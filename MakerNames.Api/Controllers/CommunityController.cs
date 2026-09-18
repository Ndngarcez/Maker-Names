using System.Text.Json;
using System.Text.RegularExpressions;
using MakerNames.Api.Services;
using MakerNames.Core.Generators;
using MakerNames.Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace MakerNames.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class CommunityController : ControllerBase
{
    private const string SessionCookieName = "makernames_session";
    private const int MaxStoredProjectJsonLength = 500_000;
    private const int MaxThumbnailPngBytes = 2_500_000;
    private static readonly JsonSerializerOptions ProjectJsonOptions = new(JsonSerializerDefaults.Web);

    private readonly CommunityStore _community;
    private readonly UserStore _users;

    public CommunityController(CommunityStore community, UserStore users)
    {
        _community = community;
        _users = users;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CommunityItemResponse>>> List(
        [FromQuery] int take = 24,
        [FromQuery] string sort = "recent",
        [FromQuery] string? clientId = null
    )
    {
        var viewerId = await GetViewerIdAsync(clientId);
        var items = await _community.ListAsync(take, sort);
        return Ok(items.Select(item => ToResponse(item, viewerId)));
    }

    [HttpGet("top")]
    public async Task<ActionResult<IEnumerable<CommunityItemResponse>>> Top(
        [FromQuery] int take = 5,
        [FromQuery] string? clientId = null
    )
    {
        var viewerId = await GetViewerIdAsync(clientId);
        var items = await _community.ListAsync(take, "top");
        return Ok(items.Select(item => ToResponse(item, viewerId)));
    }

    [HttpPost]
    public async Task<ActionResult<CommunityItemResponse>> Create([FromBody] CommunityCreateRequest request)
    {
        if (request.Project == null)
            return BadRequest(new CommunityMessageResponse("Missing design."));

        var user = await _users.GetUserBySessionAsync(Request.Cookies[SessionCookieName]);
        var title = CleanTitle(request.Title) ?? BuildTitleFromProject(request.Project);
        var now = DateTimeOffset.UtcNow;
        var service = new MakerNamesService();
        var result = service.Generate(request.Project);
        var projectJson = JsonSerializer.Serialize(request.Project, ProjectJsonOptions);

        if (projectJson.Length > MaxStoredProjectJsonLength)
            projectJson = "";

        var item = await _community.AddAsync(new CommunityItem
        {
            Id = Guid.NewGuid().ToString("N"),
            Title = title,
            Slug = Slugify(title),
            AuthorName = CleanTitle(user?.Name) ?? "Maker",
            AuthorUserId = user?.Id ?? "",
            ThumbnailSvg = result.Svg,
            ThumbnailPng = CleanThumbnailPng(request.ThumbnailPng),
            ProjectJson = projectJson,
            Downloads = 1,
            Likes = 0,
            CreatedAt = now,
            LastDownloadAt = now
        });

        return Ok(ToResponse(item, user == null ? null : $"user:{user.Id}"));
    }

    [HttpPost("{id}/like")]
    public async Task<ActionResult<CommunityLikeResult>> ToggleLike(string id, [FromBody] CommunityLikeRequest request)
    {
        var viewerId = await GetViewerIdAsync(request.ClientId);
        if (viewerId == null)
            return BadRequest(new CommunityMessageResponse("Could not identify this like."));

        var result = await _community.ToggleLikeAsync(id, viewerId);
        if (result == null)
            return NotFound(new CommunityMessageResponse("Community render not found."));

        return Ok(result);
    }

    private async Task<string?> GetViewerIdAsync(string? clientId)
    {
        var user = await _users.GetUserBySessionAsync(Request.Cookies[SessionCookieName]);
        if (user != null)
            return $"user:{user.Id}";

        var normalizedClientId = CleanClientId(clientId);
        return normalizedClientId == null ? null : $"anon:{normalizedClientId}";
    }

    private static CommunityItemResponse ToResponse(CommunityItem item, string? viewerId)
    {
        return new CommunityItemResponse(
            item.Id,
            item.Title,
            item.Slug,
            item.AuthorName,
            item.ThumbnailSvg,
            item.ThumbnailPng,
            item.Likes,
            item.Downloads,
            item.CreatedAt,
            item.LastDownloadAt,
            viewerId != null && item.LikedBy.Contains(viewerId)
        );
    }

    private static string BuildTitleFromProject(NameProject project)
    {
        var names = new List<string>();

        if (project.PlacedNames != null)
        {
            names.AddRange(project.PlacedNames
                .Select(item => item.Text)
                .Where(text => !string.IsNullOrWhiteSpace(text)));
        }

        if (!string.IsNullOrWhiteSpace(project.Text))
            names.Add(project.Text);

        var title = string.Join(" + ", names
            .Select(text => CleanTitle(text) ?? "")
            .Where(text => !string.IsNullOrWhiteSpace(text))
            .Distinct(StringComparer.OrdinalIgnoreCase));

        return string.IsNullOrWhiteSpace(title) ? "MakerNames design" : title;
    }

    private static string? CleanTitle(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return null;

        var clean = Regex.Replace(value.Trim(), @"\s+", " ");
        clean = Regex.Replace(clean, @"[^\p{L}\p{N}\s\-_'&+]", "");
        clean = clean.Trim();

        if (string.IsNullOrWhiteSpace(clean))
            return null;

        return clean.Length <= 80 ? clean : clean[..80].Trim();
    }

    private static string? CleanClientId(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return null;

        var clean = Regex.Replace(value.Trim(), @"[^a-zA-Z0-9_\-]", "");
        if (string.IsNullOrWhiteSpace(clean))
            return null;

        return clean.Length <= 80 ? clean : clean[..80];
    }

    private static string CleanThumbnailPng(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return "";

        const string prefix = "data:image/png;base64,";
        var trimmed = value.Trim();
        if (!trimmed.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
            return "";

        try
        {
            var bytes = Convert.FromBase64String(trimmed[prefix.Length..]);
            if (bytes.Length == 0 || bytes.Length > MaxThumbnailPngBytes)
                return "";

            var isPng = bytes.Length > 8 &&
                bytes[0] == 0x89 &&
                bytes[1] == 0x50 &&
                bytes[2] == 0x4E &&
                bytes[3] == 0x47 &&
                bytes[4] == 0x0D &&
                bytes[5] == 0x0A &&
                bytes[6] == 0x1A &&
                bytes[7] == 0x0A;

            return isPng ? $"{prefix}{Convert.ToBase64String(bytes)}" : "";
        }
        catch (FormatException)
        {
            return "";
        }
    }

    private static string Slugify(string value)
    {
        var slug = Regex.Replace(value.ToLowerInvariant(), @"[^\p{L}\p{N}]+", "-").Trim('-');
        if (string.IsNullOrWhiteSpace(slug))
            slug = "render";

        return slug.Length <= 80 ? slug : slug[..80].Trim('-');
    }
}

public sealed record CommunityCreateRequest(NameProject? Project, string? Title, string? ThumbnailPng);

public sealed record CommunityLikeRequest(string? ClientId);

public sealed record CommunityItemResponse(
    string Id,
    string Title,
    string Slug,
    string AuthorName,
    string ThumbnailSvg,
    string ThumbnailPng,
    int Likes,
    int Downloads,
    DateTimeOffset CreatedAt,
    DateTimeOffset LastDownloadAt,
    bool Liked
);

public sealed record CommunityMessageResponse(string Message);
