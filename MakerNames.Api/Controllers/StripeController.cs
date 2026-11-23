using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using MakerNames.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace MakerNames.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class StripeController : ControllerBase
{
    private readonly UserStore _users;
    private readonly IConfiguration _configuration;
    private readonly ILogger<StripeController> _logger;

    public StripeController(UserStore users, IConfiguration configuration, ILogger<StripeController> logger)
    {
        _users = users;
        _configuration = configuration;
        _logger = logger;
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> Webhook()
    {
        var webhookSecret = _configuration["Stripe:WebhookSecret"];
        if (string.IsNullOrWhiteSpace(webhookSecret))
            return StatusCode(StatusCodes.Status503ServiceUnavailable, "Stripe webhook is not configured.");

        using var reader = new StreamReader(Request.Body, Encoding.UTF8);
        var payload = await reader.ReadToEndAsync();
        var signature = Request.Headers["Stripe-Signature"].ToString();

        if (!IsValidStripeSignature(payload, signature, webhookSecret))
            return BadRequest("Invalid Stripe signature.");

        using var document = JsonDocument.Parse(payload);
        var root = document.RootElement;
        var eventId = GetString(root, "id");
        var eventType = GetString(root, "type");

        if (!TryGetObject(root, out var stripeObject))
            return Ok(new { received = true });

        StripeEntitlementResult? result = eventType switch
        {
            "checkout.session.completed" => await HandleCheckoutCompletedAsync(stripeObject, eventId),
            "checkout.session.async_payment_succeeded" => await HandleCheckoutCompletedAsync(stripeObject, eventId),
            "invoice.paid" => await HandleInvoicePaymentSucceededAsync(stripeObject, eventId),
            "invoice.payment_succeeded" => await HandleInvoicePaymentSucceededAsync(stripeObject, eventId),
            "customer.subscription.created" => await HandleSubscriptionChangedAsync(stripeObject, eventId),
            "customer.subscription.updated" => await HandleSubscriptionChangedAsync(stripeObject, eventId),
            "customer.subscription.deleted" => await HandleSubscriptionChangedAsync(stripeObject, eventId),
            _ => null
        };

        if (result is { Succeeded: false })
            _logger.LogWarning("Stripe event {EventId} ({EventType}) was received but not applied: {Error}", eventId, eventType, result.Error);

        return Ok(new { received = true, applied = result?.Succeeded ?? false, pending = result?.Pending ?? false });
    }

    private async Task<StripeEntitlementResult> HandleCheckoutCompletedAsync(JsonElement session, string? eventId)
    {
        var email = GetString(session, "customer_email")
            ?? GetString(session, "customer_details", "email");

        var plan = GetPlanFromCheckoutSession(session);

        return await _users.ApplyStripeCheckoutAsync(
            email,
            GetString(session, "customer"),
            GetString(session, "subscription"),
            plan,
            eventId
        );
    }

    private async Task<StripeEntitlementResult> HandleInvoicePaymentSucceededAsync(JsonElement invoice, string? eventId)
    {
        var plan = GetPlanFromInvoice(invoice);

        return await _users.ApplyStripeSubscriptionAsync(
            GetString(invoice, "customer"),
            GetString(invoice, "subscription"),
            GetString(invoice, "customer_email"),
            plan,
            active: true,
            eventId
        );
    }

    private async Task<StripeEntitlementResult> HandleSubscriptionChangedAsync(JsonElement subscription, string? eventId)
    {
        var status = GetString(subscription, "status") ?? "";
        var active = status is "active" or "trialing";
        var plan = active ? GetPlanFromSubscription(subscription) : "free";

        return await _users.ApplyStripeSubscriptionAsync(
            GetString(subscription, "customer"),
            GetString(subscription, "id"),
            null,
            plan,
            active,
            eventId
        );
    }

    private static string GetPlanFromCheckoutSession(JsonElement session)
    {
        var amount = GetLong(session, "amount_total");
        if (amount == 2999) return "studio";
        if (amount == 499) return "monthly";
        return "monthly";
    }

    private static string GetPlanFromInvoice(JsonElement invoice)
    {
        var interval = GetString(invoice, "lines", "data", 0, "price", "recurring", "interval");
        if (interval == "year") return "studio";
        if (interval == "month") return "monthly";

        var amount = GetLong(invoice, "amount_paid");
        if (amount == 2999) return "studio";
        if (amount == 499) return "monthly";
        return "monthly";
    }

    private static string GetPlanFromSubscription(JsonElement subscription)
    {
        var interval = GetString(subscription, "items", "data", 0, "price", "recurring", "interval");
        if (interval == "year") return "studio";
        if (interval == "month") return "monthly";
        return "monthly";
    }

    private static bool TryGetObject(JsonElement root, out JsonElement stripeObject)
    {
        stripeObject = default;

        if (!root.TryGetProperty("data", out var data) ||
            !data.TryGetProperty("object", out stripeObject) ||
            stripeObject.ValueKind != JsonValueKind.Object)
            return false;

        return true;
    }

    private static string? GetString(JsonElement element, params object[] path)
    {
        if (!TryGetPath(element, out var value, path))
            return null;

        return value.ValueKind == JsonValueKind.String ? value.GetString() : null;
    }

    private static long? GetLong(JsonElement element, params object[] path)
    {
        if (!TryGetPath(element, out var value, path))
            return null;

        return value.ValueKind == JsonValueKind.Number && value.TryGetInt64(out var number)
            ? number
            : null;
    }

    private static bool TryGetPath(JsonElement element, out JsonElement value, params object[] path)
    {
        value = element;

        foreach (var part in path)
        {
            if (part is string name)
            {
                if (value.ValueKind != JsonValueKind.Object || !value.TryGetProperty(name, out value))
                    return false;
            }
            else if (part is int index)
            {
                if (value.ValueKind != JsonValueKind.Array || value.GetArrayLength() <= index)
                    return false;

                value = value[index];
            }
        }

        return true;
    }

    private static bool IsValidStripeSignature(string payload, string header, string secret)
    {
        var parts = header
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(part => part.Split('=', 2))
            .Where(part => part.Length == 2)
            .ToDictionary(part => part[0], part => part[1]);

        if (!parts.TryGetValue("t", out var timestamp) || !parts.TryGetValue("v1", out var expected))
            return false;

        if (!long.TryParse(timestamp, out var unixTime))
            return false;

        var signedPayload = $"{timestamp}.{payload}";
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(signedPayload));
        var computed = Convert.ToHexString(hash).ToLowerInvariant();

        var expectedBytes = Encoding.ASCII.GetBytes(expected.ToLowerInvariant());
        var computedBytes = Encoding.ASCII.GetBytes(computed);

        return expectedBytes.Length == computedBytes.Length &&
               CryptographicOperations.FixedTimeEquals(expectedBytes, computedBytes) &&
               Math.Abs(DateTimeOffset.UtcNow.ToUnixTimeSeconds() - unixTime) <= 300;
    }
}
