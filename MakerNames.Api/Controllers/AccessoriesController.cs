using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using MakerNames.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace MakerNames.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class AccessoriesController : ControllerBase
{
    private const string SessionCookieName = "makernames_session";
    private const int MaxSvgLength = 260_000;

    private readonly CommunityAccessoryStore _accessories;
    private readonly UserStore _users;

    public AccessoriesController(CommunityAccessoryStore accessories, UserStore users)
    {
        _accessories = accessories;
        _users = users;
    }

    [HttpGet("community")]
    public async Task<ActionResult<IEnumerable<CommunityAccessoryResponse>>> Community([FromQuery] int take = 180)
    {
        var items = await _accessories.ListAsync(take);
        return Ok(items.Select(ToResponse));
    }

    [HttpGet("community/{id}.svg")]
    public async Task<IActionResult> CommunitySvg(string id)
    {
        var item = await _accessories.GetAsync(id);
        if (item == null)
            return NotFound();

        return Content(item.SvgText, "image/svg+xml", Encoding.UTF8);
    }

    [HttpPost("community")]
    public async Task<ActionResult<CommunityAccessoryResponse>> CreateCommunity([FromBody] CommunityAccessoryCreateRequest request)
    {
        var svgText = CleanSvgText(request.SvgText);
        if (svgText == null)
            return BadRequest(new AccessoryMessageResponse("Invalid SVG accessory."));

        var stlRisk = CleanStlRisk(request.StlRisk, request.Verified3d);
        var now = DateTimeOffset.UtcNow;
        var user = await _users.GetUserBySessionAsync(Request.Cookies[SessionCookieName]);
        var item = await _accessories.AddAsync(new CommunityAccessoryItem
        {
            Id = Guid.NewGuid().ToString("N"),
            Name = CleanName(request.Name) ?? "Community SVG",
            Category = BuildCategory(stlRisk),
            SvgText = svgText,
            Hash = ComputeHash(svgText),
            AuthorName = CleanName(user?.Name) ?? "Maker",
            AuthorUserId = user?.Id ?? "",
            StlRisk = stlRisk,
            StlIssues = CleanIssues(request.StlIssues),
            StlNodes = Math.Clamp(request.StlNodes ?? 0, 0, 200_000),
            Verified3d = stlRisk == "safe",
            Scale = 0.34f,
            Uses = 1,
            CreatedAt = now,
            LastUsedAt = now
        });

        return Ok(ToResponse(item));
    }

    private static CommunityAccessoryResponse ToResponse(CommunityAccessoryItem item)
    {
        return new CommunityAccessoryResponse(
            item.Id,
            item.Name,
            item.Category,
            $"/api/Accessories/community/{item.Id}.svg",
            "svg",
            item.Scale,
            item.Verified3d,
            item.StlRisk,
            item.StlIssues,
            item.StlNodes,
            item.AuthorName,
            "community",
            item.Uses,
            item.CreatedAt
        );
    }

    private static string? CleanSvgText(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return null;

        var trimmed = value.Trim();
        if (trimmed.Length > MaxSvgLength)
            return null;

        var match = Regex.Match(trimmed, @"<svg\b[\s\S]*?</svg>", RegexOptions.IgnoreCase);
        if (!match.Success)
            return null;

        var clean = match.Value;
        clean = Regex.Replace(clean, @"<script\b[\s\S]*?</script>", "", RegexOptions.IgnoreCase);
        clean = Regex.Replace(clean, @"<foreignObject\b[\s\S]*?</foreignObject>", "", RegexOptions.IgnoreCase);
        clean = Regex.Replace(clean, @"<(iframe|object|embed|image)\b[\s\S]*?</\1>", "", RegexOptions.IgnoreCase);
        clean = Regex.Replace(clean, @"<(iframe|object|embed|image)\b[^>]*?/?>", "", RegexOptions.IgnoreCase);
        clean = Regex.Replace(clean, @"\s+on[a-z0-9]+\s*=\s*(""[^""]*""|'[^']*')", "", RegexOptions.IgnoreCase);
        clean = Regex.Replace(clean, @"\s+(href|xlink:href)\s*=\s*(""|')\s*javascript:[\s\S]*?\2", "", RegexOptions.IgnoreCase);

        return clean.Length is > 0 and <= MaxSvgLength && clean.Contains("<svg", StringComparison.OrdinalIgnoreCase)
            ? clean
            : null;
    }

    private static string CleanStlRisk(string? value, bool? verified3d)
    {
        var risk = (value ?? "").Trim().ToLowerInvariant();
        if (risk is "safe" or "review" or "visual-only")
            return verified3d == true && risk == "safe" ? "safe" : risk;

        return verified3d == true ? "safe" : "review";
    }

    private static List<string> CleanIssues(IEnumerable<string>? issues)
    {
        if (issues == null)
            return [];

        return issues
            .Select(issue => CleanIssue(issue))
            .Where(issue => !string.IsNullOrWhiteSpace(issue))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .Take(8)
            .ToList()!;
    }

    private static string? CleanIssue(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return null;

        var clean = Regex.Replace(value.Trim(), @"[^\p{L}\p{N}\s\-_,.:]", "");
        clean = Regex.Replace(clean, @"\s+", " ").Trim();
        return clean.Length <= 80 ? clean : clean[..80].Trim();
    }

    private static string? CleanName(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return null;

        var clean = Regex.Replace(value.Trim(), @"[^\p{L}\p{N}\s\-_'&+]", "");
        clean = Regex.Replace(clean, @"\s+", " ").Trim();
        return string.IsNullOrWhiteSpace(clean)
            ? null
            : clean.Length <= 60 ? clean : clean[..60].Trim();
    }

    private static string BuildCategory(string stlRisk)
    {
        return stlRisk switch
        {
            "safe" => "Community STL verified",
            "visual-only" => "Community 2D only",
            _ => "Community - Check 3D"
        };
    }

    private static string ComputeHash(string value)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(value));
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }
}

public sealed record CommunityAccessoryCreateRequest(
    string? Name,
    string? SvgText,
    bool? Verified3d,
    string? StlRisk,
    List<string>? StlIssues,
    int? StlNodes
);

public sealed record CommunityAccessoryResponse(
    string Id,
    string Name,
    string Category,
    string File,
    string Type,
    float Scale,
    bool Verified3d,
    string StlRisk,
    List<string> StlIssues,
    int StlNodes,
    string AuthorName,
    string Source,
    int Uses,
    DateTimeOffset CreatedAt
);

public sealed record AccessoryMessageResponse(string Message);
