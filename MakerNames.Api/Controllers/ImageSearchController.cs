using System.Net;
using System.Net.Sockets;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace MakerNames.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ImageSearchController : ControllerBase
{
    private const int DefaultMaxResults = 12;
    private const long MaxImageBytes = 6 * 1024 * 1024;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<ImageSearchController> _logger;

    public ImageSearchController(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        ILogger<ImageSearchController> logger)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<ImageSearchResponse>> Search([FromQuery] string? q, CancellationToken cancellationToken)
    {
        var cleanQuery = (q ?? "").Trim();
        if (string.IsNullOrWhiteSpace(cleanQuery))
            return BadRequest(new ImageSearchError("Type what image you want to search for."));

        var optimizedQuery = BuildOutlineQuery(cleanQuery);
        var maxResults = GetMaxResults();
        var provider = (_configuration["ImageSearch:Provider"] ?? "").Trim().ToLowerInvariant();
        var hasGoogleConfig = HasGoogleConfig();

        if (provider is "google" or "customsearch" || hasGoogleConfig)
        {
            if (!hasGoogleConfig)
                _logger.LogWarning("Google image search was selected, but GoogleSearch settings are incomplete. Falling back to Openverse.");
            else
            {
                var googleItems = await SearchGoogleAsync(optimizedQuery, maxResults, cancellationToken);
                if (googleItems.Count > 0)
                    return Ok(new ImageSearchResponse("Google", optimizedQuery, googleItems));

                _logger.LogInformation("Google image search returned no results for {Query}. Falling back to Openverse.", optimizedQuery);
            }
        }

        var openverseResult = await SearchOpenverseAsync(cleanQuery, optimizedQuery, maxResults, cancellationToken);
        return Ok(new ImageSearchResponse("Openverse", openverseResult.Query, openverseResult.Items));
    }

    [HttpGet("proxy")]
    public async Task<IActionResult> Proxy([FromQuery] string? url, CancellationToken cancellationToken)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri) ||
            uri.Scheme is not ("http" or "https") ||
            await IsUnsafeHostAsync(uri.Host, cancellationToken))
        {
            return BadRequest("Invalid image URL.");
        }

        using var request = new HttpRequestMessage(HttpMethod.Get, uri);
        request.Headers.UserAgent.ParseAdd("MakerNames/1.0 (+https://www.makernames.app)");

        using var response = await _httpClientFactory
            .CreateClient("image-search")
            .SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken);

        if (!response.IsSuccessStatusCode)
            return StatusCode(StatusCodes.Status502BadGateway, "Could not load the image.");

        var contentType = response.Content.Headers.ContentType?.MediaType ?? "";
        if (!contentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
            return BadRequest("The URL does not point to an image.");

        if (response.Content.Headers.ContentLength > MaxImageBytes)
            return BadRequest("The image is too large.");

        await using var input = await response.Content.ReadAsStreamAsync(cancellationToken);
        using var output = new MemoryStream();
        var buffer = new byte[81920];
        long total = 0;

        while (true)
        {
            var read = await input.ReadAsync(buffer.AsMemory(0, buffer.Length), cancellationToken);
            if (read == 0) break;
            total += read;

            if (total > MaxImageBytes)
                return BadRequest("The image is too large.");

            output.Write(buffer, 0, read);
        }

        Response.Headers.CacheControl = "public, max-age=86400";
        return File(output.ToArray(), contentType);
    }

    private async Task<IReadOnlyList<ImageSearchItem>> SearchGoogleAsync(string query, int maxResults, CancellationToken cancellationToken)
    {
        var key = _configuration["GoogleSearch:ApiKey"]?.Trim();
        var cx = _configuration["GoogleSearch:Cx"]?.Trim();
        var rights = _configuration["GoogleSearch:Rights"]?.Trim();
        var url = "https://www.googleapis.com/customsearch/v1" +
            $"?key={Uri.EscapeDataString(key!)}" +
            $"&cx={Uri.EscapeDataString(cx!)}" +
            $"&q={Uri.EscapeDataString(query)}" +
            "&searchType=image" +
            "&safe=active" +
            "&imgType=lineart" +
            $"&num={Math.Clamp(maxResults, 1, 10)}" +
            "&fields=items(title,link,displayLink,image/contextLink,image/thumbnailLink,image/width,image/height)";

        if (!string.IsNullOrWhiteSpace(rights))
            url += $"&rights={Uri.EscapeDataString(rights)}";

        using var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.UserAgent.ParseAdd("MakerNames/1.0 (+https://www.makernames.app)");

        using var response = await _httpClientFactory
            .CreateClient("image-search")
            .SendAsync(request, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogWarning("Google image search returned {StatusCode}.", response.StatusCode);
            return Array.Empty<ImageSearchItem>();
        }

        await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        using var document = await JsonDocument.ParseAsync(stream, cancellationToken: cancellationToken);

        if (!document.RootElement.TryGetProperty("items", out var items) ||
            items.ValueKind != JsonValueKind.Array)
        {
            return Array.Empty<ImageSearchItem>();
        }

        return items
            .EnumerateArray()
            .Select(item =>
            {
                var image = item.TryGetProperty("image", out var imageElement) ? imageElement : default;
                return new ImageSearchItem(
                    GetString(item, "title") ?? "Outline image",
                    GetString(item, "link") ?? "",
                    GetString(image, "thumbnailLink") ?? "",
                    GetString(image, "contextLink") ?? "",
                    GetString(item, "displayLink") ?? "",
                    "Google"
                );
            })
            .Where(item => !string.IsNullOrWhiteSpace(item.ImageUrl))
            .Take(maxResults)
            .ToList();
    }

    private async Task<(string Query, IReadOnlyList<ImageSearchItem> Items)> SearchOpenverseAsync(
        string cleanQuery,
        string optimizedQuery,
        int maxResults,
        CancellationToken cancellationToken)
    {
        var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var results = new List<ImageSearchItem>();
        var usedQuery = optimizedQuery;

        foreach (var query in BuildOpenverseQueries(cleanQuery, optimizedQuery))
        {
            var items = await SearchOpenverseSingleQueryAsync(query, maxResults, cancellationToken);
            if (items.Count == 0)
                continue;

            usedQuery = query;

            foreach (var item in items)
            {
                if (!seen.Add(item.ImageUrl))
                    continue;

                results.Add(item);
                if (results.Count >= maxResults)
                    return (usedQuery, results);
            }
        }

        return (usedQuery, results);
    }

    private async Task<IReadOnlyList<ImageSearchItem>> SearchOpenverseSingleQueryAsync(string query, int maxResults, CancellationToken cancellationToken)
    {
        var url = "https://api.openverse.org/v1/images/" +
            $"?q={Uri.EscapeDataString(query)}" +
            $"&page_size={Math.Clamp(maxResults, 1, 20)}" +
            "&mature=false";

        using var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.UserAgent.ParseAdd("MakerNames/1.0 (+https://www.makernames.app)");

        using var response = await _httpClientFactory
            .CreateClient("image-search")
            .SendAsync(request, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogWarning("Openverse image search returned {StatusCode}.", response.StatusCode);
            return Array.Empty<ImageSearchItem>();
        }

        await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        using var document = await JsonDocument.ParseAsync(stream, cancellationToken: cancellationToken);

        if (!document.RootElement.TryGetProperty("results", out var results) ||
            results.ValueKind != JsonValueKind.Array)
        {
            return Array.Empty<ImageSearchItem>();
        }

        return results
            .EnumerateArray()
            .Select(item => new ImageSearchItem(
                GetString(item, "title") ?? "Open image",
                GetString(item, "url") ?? "",
                GetString(item, "thumbnail") ?? "",
                GetString(item, "foreign_landing_url") ?? "",
                GetString(item, "license") ?? "Openverse",
                "Openverse"
            ))
            .Where(item => !string.IsNullOrWhiteSpace(item.ImageUrl))
            .Take(maxResults)
            .ToList();
    }

    private static IReadOnlyList<string> BuildOpenverseQueries(string cleanQuery, string optimizedQuery)
    {
        var query = cleanQuery.Trim();
        var queries = new[]
        {
            optimizedQuery,
            $"{query} outline",
            $"{query} silhouette",
            $"{query} icon",
            $"{query} black white",
            query
        };

        return queries
            .Where(value => !string.IsNullOrWhiteSpace(value))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();
    }

    private string BuildOutlineQuery(string query)
    {
        var suffix = _configuration["ImageSearch:QuerySuffix"]?.Trim();
        if (string.IsNullOrWhiteSpace(suffix))
            suffix = "coloring page outline black and white";

        return $"{query} {suffix}";
    }

    private bool HasGoogleConfig()
    {
        return !string.IsNullOrWhiteSpace(_configuration["GoogleSearch:ApiKey"]) &&
            !string.IsNullOrWhiteSpace(_configuration["GoogleSearch:Cx"]);
    }

    private int GetMaxResults()
    {
        if (!int.TryParse(_configuration["ImageSearch:MaxResults"], out var value))
            return DefaultMaxResults;

        return Math.Clamp(value, 1, 20);
    }

    private static string? GetString(JsonElement element, string property)
    {
        if (element.ValueKind != JsonValueKind.Object ||
            !element.TryGetProperty(property, out var value) ||
            value.ValueKind != JsonValueKind.String)
        {
            return null;
        }

        return value.GetString();
    }

    private static async Task<bool> IsUnsafeHostAsync(string host, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(host))
            return true;

        if (host.Equals("localhost", StringComparison.OrdinalIgnoreCase) ||
            host.EndsWith(".local", StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }

        if (IPAddress.TryParse(host, out var parsedAddress))
            return IsPrivateAddress(parsedAddress);

        try
        {
            var addresses = await Dns.GetHostAddressesAsync(host, cancellationToken);
            return addresses.Any(IsPrivateAddress);
        }
        catch
        {
            return true;
        }
    }

    private static bool IsPrivateAddress(IPAddress address)
    {
        if (IPAddress.IsLoopback(address))
            return true;

        if (address.AddressFamily == AddressFamily.InterNetworkV6)
        {
            return address.IsIPv6LinkLocal ||
                address.IsIPv6SiteLocal ||
                address.GetAddressBytes()[0] is 0xfc or 0xfd;
        }

        if (address.AddressFamily != AddressFamily.InterNetwork)
            return true;

        var bytes = address.GetAddressBytes();
        return bytes[0] is 0 or 10 or 127 ||
            bytes[0] == 169 && bytes[1] == 254 ||
            bytes[0] == 172 && bytes[1] >= 16 && bytes[1] <= 31 ||
            bytes[0] == 192 && bytes[1] == 168 ||
            bytes[0] == 100 && bytes[1] >= 64 && bytes[1] <= 127;
    }
}

public sealed record ImageSearchResponse(
    string Provider,
    string Query,
    IReadOnlyList<ImageSearchItem> Items
);

public sealed record ImageSearchItem(
    string Title,
    string ImageUrl,
    string ThumbnailUrl,
    string SourceUrl,
    string Source,
    string Provider
);

public sealed record ImageSearchError(string Message);
