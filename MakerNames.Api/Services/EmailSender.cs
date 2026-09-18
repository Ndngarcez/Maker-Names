using System.Net;
using System.Net.Mail;
using System.Text;

namespace MakerNames.Api.Services;

public sealed class EmailSender
{
    private readonly IConfiguration _configuration;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<EmailSender> _logger;

    public EmailSender(IConfiguration configuration, IWebHostEnvironment environment, ILogger<EmailSender> logger)
    {
        _configuration = configuration;
        _environment = environment;
        _logger = logger;
    }

    public async Task SendAccountVerificationAsync(string email, string name, string verificationUrl)
    {
        var subject = "Activate your MakerNames account";
        var displayName = string.IsNullOrWhiteSpace(name) ? email : name;
        var body = $"""
            Hi {displayName},

            Thanks for creating a MakerNames account.

            Activate your account here:
            {verificationUrl}

            If you did not create this account, you can safely ignore this email.
            """;

        await SendEmailAsync(email, subject, body);
        _logger.LogInformation("Verification email for {Email}: {VerificationUrl}", email, verificationUrl);
    }

    public async Task SendPasswordResetAsync(string email, string name, string resetUrl)
    {
        var subject = "Reset your MakerNames password";
        var displayName = string.IsNullOrWhiteSpace(name) ? email : name;
        var body = $"""
            Hi {displayName},

            We received a request to reset your MakerNames password.

            Choose a new password here:
            {resetUrl}

            This link expires in 1 hour. If you did not request this change, you can safely ignore this email.
            """;

        await SendEmailAsync(email, subject, body);
        _logger.LogInformation("Password reset email for {Email}: {ResetUrl}", email, resetUrl);
    }

    public async Task SendNewSignupNotificationAsync(PublicUser user)
    {
        var adminEmail = _configuration["Notifications:AdminEmail"];
        if (string.IsNullOrWhiteSpace(adminEmail))
        {
            _logger.LogInformation("New signup notification skipped because Notifications:AdminEmail is not configured.");
            return;
        }

        var subject = $"New MakerNames signup: {user.Email}";
        var body = $"""
            New MakerNames signup

            Name: {user.Name}
            Email: {user.Email}
            Plan: {user.Plan}
            Email verified: {(user.EmailVerified ? "Yes" : "No")}
            Registered at UTC: {DateTimeOffset.UtcNow:yyyy-MM-dd HH:mm:ss}
            """;

        try
        {
            await SendEmailAsync(adminEmail, subject, body);
            _logger.LogInformation("New signup notification sent to {AdminEmail} for {Email}", adminEmail, user.Email);
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Failed to send new signup notification for {Email}", user.Email);
        }
    }

    public async Task SendDownloadNotificationAsync(DownloadNotification notification)
    {
        var adminEmail = _configuration["Notifications:AdminEmail"];
        if (string.IsNullOrWhiteSpace(adminEmail))
        {
            _logger.LogInformation("Download notification skipped because Notifications:AdminEmail is not configured.");
            return;
        }

        var account = notification.User == null
            ? "Visitor - not signed in"
            : $"{notification.User.Name} <{notification.User.Email}>";
        var sponsorVideo = notification.User == null ? "Yes" : "No";
        var subject = $"MakerNames download: {notification.Name} ({notification.Format.ToUpperInvariant()})";
        var body = $"""
            MakerNames download

            Name/file: {notification.Name}
            Format: {notification.Format.ToUpperInvariant()}
            Account: {account}
            Sponsor video required: {sponsorVideo}
            Page: {notification.Page}
            Time UTC: {DateTimeOffset.UtcNow:yyyy-MM-dd HH:mm:ss}
            """;

        try
        {
            await SendEmailAsync(adminEmail, subject, body);
            _logger.LogInformation(
                "Download notification sent to {AdminEmail} for {Name} ({Format})",
                adminEmail,
                notification.Name,
                notification.Format
            );
        }
        catch (Exception exception)
        {
            _logger.LogError(
                exception,
                "Failed to send download notification for {Name} ({Format})",
                notification.Name,
                notification.Format
            );
        }
    }

    private async Task SendEmailAsync(string email, string subject, string body)
    {
        var host = _configuration["Smtp:Host"];
        var username = _configuration["Smtp:UserName"];
        var password = _configuration["Smtp:Password"];

        if (string.IsNullOrWhiteSpace(host) ||
            (_environment.IsDevelopment() && (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))))
        {
            await SaveDevelopmentEmailAsync(email, subject, body);
            _logger.LogInformation("Email saved to a local file for {Email}: {Subject}", email, subject);
            return;
        }

        using var message = new MailMessage
        {
            From = new MailAddress(
                _configuration["Smtp:FromEmail"] ?? "no-reply@makernames.local",
                _configuration["Smtp:FromName"] ?? "MakerNames"
            ),
            Subject = subject,
            Body = body,
            BodyEncoding = Encoding.UTF8,
            SubjectEncoding = Encoding.UTF8
        };

        message.To.Add(email);

        using var client = new SmtpClient(host)
        {
            Port = int.TryParse(_configuration["Smtp:Port"], out var port) ? port : 587,
            EnableSsl = bool.TryParse(_configuration["Smtp:EnableSsl"], out var enableSsl) ? enableSsl : true
        };

        if (!string.IsNullOrWhiteSpace(username))
            client.Credentials = new NetworkCredential(username, password);

        await client.SendMailAsync(message);
    }

    private async Task SaveDevelopmentEmailAsync(string email, string subject, string body)
    {
        var directory = Path.Combine(_environment.ContentRootPath, "App_Data", "emails");
        Directory.CreateDirectory(directory);

        var fileName = $"{DateTimeOffset.UtcNow:yyyyMMddHHmmssfff}-{SanitizeFileName(email)}.txt";
        var content = $"To: {email}{Environment.NewLine}Subject: {subject}{Environment.NewLine}{Environment.NewLine}{body}";
        await File.WriteAllTextAsync(Path.Combine(directory, fileName), content, Encoding.UTF8);
    }

    private static string SanitizeFileName(string value)
    {
        var invalid = Path.GetInvalidFileNameChars();
        var builder = new StringBuilder(value.Length);

        foreach (var character in value)
            builder.Append(invalid.Contains(character) ? '_' : character);

        return builder.ToString();
    }
}

public sealed record DownloadNotification(
    string Name,
    string Format,
    PublicUser? User,
    string Page
);
