using MakerNames.Core.Generators;
using MakerNames.Core.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Concurrent;
using System.IO.Compression;
using System.Drawing.Text;
using System.Text;
using System.Text.Json;
using MakerNames.Api.Services;

namespace MakerNames.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GenerateController : ControllerBase
{
    private const string SessionCookieName = "makernames_session";
    private const long MaxFontUploadBytes = 8L * 1024L * 1024L;
    private const int MaxRenderPngBytes = 2_500_000;
    private static readonly ConcurrentDictionary<string, DownloadBundle> Downloads = new();
    private readonly UserStore _users;
    private readonly IWebHostEnvironment _environment;
    private readonly EmailSender _emails;

    public GenerateController(UserStore users, IWebHostEnvironment environment, EmailSender emails)
    {
        _users = users;
        _environment = environment;
        _emails = emails;
    }

    [HttpGet("fonts")]
    public ActionResult<IEnumerable<string>> Fonts()
    {
        using InstalledFontCollection fonts = new();

        var names = fonts.Families
            .Select(font => font.Name)
            .Concat(FontRegistry.GetCustomFonts().Select(font => font.Name))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .OrderBy(name => name);

        return Ok(names);
    }

    [HttpGet("font-catalog")]
    public ActionResult<IEnumerable<CustomFontInfo>> FontCatalog()
    {
        return Ok(FontRegistry.GetCustomFonts());
    }

    [HttpPost("font-upload")]
    [RequestSizeLimit(MaxFontUploadBytes)]
    public async Task<ActionResult<CustomFontInfo>> UploadFont([FromForm] IFormFile? file, CancellationToken cancellationToken)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new ApiError("Choose a .ttf or .otf font file."));

        if (file.Length > MaxFontUploadBytes)
            return BadRequest(new ApiError("Font file is too large. The maximum size is 8 MB."));

        var extension = Path.GetExtension(file.FileName);
        if (!extension.Equals(".ttf", StringComparison.OrdinalIgnoreCase) &&
            !extension.Equals(".otf", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new ApiError("Only .ttf and .otf fonts can be imported."));
        }

        var fontsPath = Path.Combine(_environment.WebRootPath, "fonts");
        Directory.CreateDirectory(fontsPath);

        var tempPath = Path.Combine(fontsPath, $"user-upload-{Guid.NewGuid():N}{extension.ToLowerInvariant()}");

        try
        {
            await using (var output = System.IO.File.Create(tempPath))
            {
                await file.CopyToAsync(output, cancellationToken);
            }

            var families = FontRegistry.ReadFontFamilyNames(tempPath);
            if (families.Count == 0)
                return BadRequest(new ApiError("That file is not a valid supported font."));

            var fontName = families[0];
            var finalFileName = CreateUniqueFontFileName(fontsPath, fontName, extension);
            var finalPath = Path.Combine(fontsPath, finalFileName);
            System.IO.File.Move(tempPath, finalPath);

            FontRegistry.Reload();

            return Ok(new CustomFontInfo(fontName, finalFileName, true));
        }
        catch (IOException)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiError("Could not save the uploaded font."));
        }
        finally
        {
            if (System.IO.File.Exists(tempPath))
                System.IO.File.Delete(tempPath);
        }
    }

    private static string CreateUniqueFontFileName(string fontsPath, string fontName, string extension)
    {
        var safeName = SlugFontName(fontName);
        var normalizedExtension = extension.ToLowerInvariant();
        var fileName = $"user-{safeName}{normalizedExtension}";
        var path = Path.Combine(fontsPath, fileName);
        var index = 2;

        while (System.IO.File.Exists(path))
        {
            fileName = $"user-{safeName}-{index}{normalizedExtension}";
            path = Path.Combine(fontsPath, fileName);
            index++;
        }

        return fileName;
    }

    private static string SlugFontName(string fontName)
    {
        var builder = new StringBuilder();

        foreach (var character in fontName.ToLowerInvariant())
        {
            if (character is >= 'a' and <= 'z' or >= '0' and <= '9')
            {
                builder.Append(character);
            }
            else if (builder.Length > 0 && builder[^1] != '-')
            {
                builder.Append('-');
            }
        }

        var slug = builder.ToString().Trim('-');
        if (string.IsNullOrWhiteSpace(slug))
            slug = "font";

        return slug.Length <= 80 ? slug : slug[..80].Trim('-');
    }

    [HttpPost]
    public ActionResult<GenerateResult> Generate([FromBody] NameProject project)
    {
        var service = new MakerNamesService();

        var result = service.Generate(project);

        return Ok(result);
    }

    [HttpPost("svg")]
    public IActionResult SvgPost([FromBody] NameProject project)
    {
        var service = new MakerNamesService();

        var result = service.Generate(project);

        return Content(result.Svg, "image/svg+xml");
    }

    [HttpPost("dxf")]
    public IActionResult DxfPost([FromBody] NameProject project)
    {
        var service = new MakerNamesService();

        var result = service.Generate(project);

        return Content(result.Dxf, "application/dxf");
    }

    [HttpPost("stl")]
    public IActionResult StlPost([FromBody] NameProject project)
    {
        var service = new MakerNamesService();

        var result = service.Generate(project);

        return Content(result.Stl, "model/stl");
    }

    [HttpPost("package")]
    public IActionResult PackagePost([FromBody] NameProject project)
    {
        var service = new MakerNamesService();

        var result = service.Generate(project);
        var name = CleanFileName(project.Text);

        using MemoryStream stream = new();

        using (ZipArchive archive = new(stream, ZipArchiveMode.Create, true))
        {
            AddZipEntry(archive, $"{name}.svg", result.Svg);
            AddZipEntry(archive, $"{name}.dxf", result.Dxf);
            AddZipEntry(archive, $"{name}.stl", result.Stl);
        }

        QueueDownloadNotification(name, "package", null);
        return File(stream.ToArray(), "application/zip", $"{name}.zip");
    }

    [HttpPost("prepare-downloads")]
    public async Task<ActionResult<PrepareDownloadResponse>> PrepareDownloads([FromBody] NameProject project)
    {
        var user = await _users.GetUserBySessionAsync(Request.Cookies[SessionCookieName]);
        var service = new MakerNamesService();
        var renderPng = DecodePngDataUrl(project.RenderPngDataUrl);
        project.RenderPngDataUrl = null;
        var result = service.Generate(project);
        var name = CleanFileName(project.Text);
        var token = Guid.NewGuid().ToString("N");

        Downloads[token] = new DownloadBundle(name, user?.Id, result, renderPng, DateTimeOffset.UtcNow.AddMinutes(30));

        return Ok(new PrepareDownloadResponse(
            $"/api/Generate/file/{token}/svg",
            $"/api/Generate/file/{token}/dxf",
            $"/api/Generate/file/{token}/stl",
            $"/api/Generate/file/{token}/package",
            user
        ));
    }

    [HttpPost("save-to-downloads")]
    public async Task<IActionResult> SaveToDownloads([FromBody] NameProject project)
    {
        var user = await _users.GetUserBySessionAsync(Request.Cookies[SessionCookieName]);

        var service = new MakerNamesService();
        var result = service.Generate(project);
        var name = CleanFileName(project.Text);
        var folder = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.UserProfile),
            "Downloads",
            "MakerNames"
        );

        Directory.CreateDirectory(folder);

        var svgPath = Path.Combine(folder, $"{name}.svg");
        var dxfPath = Path.Combine(folder, $"{name}.dxf");
        var stlPath = Path.Combine(folder, $"{name}.stl");
        var zipPath = Path.Combine(folder, $"{name}.zip");

        System.IO.File.WriteAllText(svgPath, result.Svg, Encoding.UTF8);
        System.IO.File.WriteAllText(dxfPath, result.Dxf, Encoding.ASCII);
        System.IO.File.WriteAllText(stlPath, result.Stl, Encoding.ASCII);
        System.IO.File.WriteAllBytes(zipPath, CreatePackage(name, result));

        return Ok(new SaveDownloadsResponse(folder, svgPath, dxfPath, stlPath, zipPath, user));
    }

    [HttpGet("file/{token}/{format}")]
    public async Task<IActionResult> FileDownload(string token, string format)
    {
        RemoveExpiredDownloads();

        if (!Downloads.TryGetValue(token, out var bundle))
            return NotFound("This download link has expired or does not exist.");

        var normalizedFormat = format.ToLowerInvariant();

        if (!IsDownloadFormat(normalizedFormat))
            return BadRequest("Invalid format.");

        PublicUser? user = null;

        if (!string.IsNullOrWhiteSpace(bundle.UserId))
        {
            user = await _users.GetUserBySessionAsync(Request.Cookies[SessionCookieName]);
            if (user == null)
                return Unauthorized(new DownloadLimitResponse("Sign in again to use this account download link.", null));

            if (!string.Equals(user.Id, bundle.UserId, StringComparison.Ordinal))
                return StatusCode(403, new DownloadLimitResponse("This download belongs to another session.", user));
        }

        QueueDownloadNotificationOnce(bundle, normalizedFormat, user);

        return normalizedFormat switch
        {
            "svg" => File(Encoding.UTF8.GetBytes(bundle.Result.Svg), "image/svg+xml", $"{bundle.Name}.svg"),
            "dxf" => File(Encoding.ASCII.GetBytes(bundle.Result.Dxf), "application/dxf", $"{bundle.Name}.dxf"),
            "stl" => File(Encoding.ASCII.GetBytes(bundle.Result.Stl), "model/stl", $"{bundle.Name}.stl"),
            "package" => File(CreatePackage(bundle.Name, bundle.Result, bundle.RenderPng), "application/zip", $"{bundle.Name}.zip"),
            _ => BadRequest("Invalid format.")
        };
    }

    [HttpPost("download/{format}")]
    public IActionResult Download(string format, [FromForm] string projectJson)
    {
        var normalizedFormat = format.ToLowerInvariant();
        if (!IsDownloadFormat(normalizedFormat))
            return BadRequest("Invalid format.");

        var project = JsonSerializer.Deserialize<NameProject>(
            projectJson,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
        );

        if (project == null)
            return BadRequest("Invalid project.");

        var service = new MakerNamesService();
        var result = service.Generate(project);
        var name = CleanFileName(project.Text);

        QueueDownloadNotification(name, normalizedFormat, null);

        return normalizedFormat switch
        {
            "svg" => File(Encoding.UTF8.GetBytes(result.Svg), "image/svg+xml", $"{name}.svg"),
            "dxf" => File(Encoding.ASCII.GetBytes(result.Dxf), "application/dxf", $"{name}.dxf"),
            "stl" => File(Encoding.ASCII.GetBytes(result.Stl), "model/stl", $"{name}.stl"),
            "package" => File(CreatePackage(name, result), "application/zip", $"{name}.zip"),
            _ => BadRequest("Invalid format.")
        };
    }

    private static void AddZipEntry(ZipArchive archive, string fileName, string content)
    {
        var entry = archive.CreateEntry(fileName);

        using var writer = new StreamWriter(entry.Open());
        writer.Write(content);
    }

    private static void AddZipEntry(ZipArchive archive, string fileName, byte[] content)
    {
        var entry = archive.CreateEntry(fileName);
        using var stream = entry.Open();
        stream.Write(content, 0, content.Length);
    }

    private static byte[] CreatePackage(string name, GenerateResult result, byte[]? renderPng = null)
    {
        using MemoryStream stream = new();

        using (ZipArchive archive = new(stream, ZipArchiveMode.Create, true))
        {
            AddZipEntry(archive, $"{name}.svg", result.Svg);
            AddZipEntry(archive, $"{name}.dxf", result.Dxf);
            AddZipEntry(archive, $"{name}.stl", result.Stl);
            if (renderPng is { Length: > 0 })
                AddZipEntry(archive, $"{name}-3d-render.png", renderPng);
        }

        return stream.ToArray();
    }

    private static byte[]? DecodePngDataUrl(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return null;

        const string prefix = "data:image/png;base64,";
        var trimmed = value.Trim();
        if (!trimmed.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
            return null;

        try
        {
            var bytes = Convert.FromBase64String(trimmed[prefix.Length..]);
            if (bytes.Length == 0 || bytes.Length > MaxRenderPngBytes)
                return null;

            var isPng = bytes.Length > 8 &&
                bytes[0] == 0x89 &&
                bytes[1] == 0x50 &&
                bytes[2] == 0x4E &&
                bytes[3] == 0x47 &&
                bytes[4] == 0x0D &&
                bytes[5] == 0x0A &&
                bytes[6] == 0x1A &&
                bytes[7] == 0x0A;

            return isPng ? bytes : null;
        }
        catch (FormatException)
        {
            return null;
        }
    }

    private static string CleanFileName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return "makernames";

        foreach (char c in Path.GetInvalidFileNameChars())
            name = name.Replace(c.ToString(), "");

        return string.IsNullOrWhiteSpace(name) ? "makernames" : name;
    }

    private static void RemoveExpiredDownloads()
    {
        var now = DateTimeOffset.UtcNow;

        foreach (var item in Downloads)
        {
            if (item.Value.ExpiresAt <= now)
                Downloads.TryRemove(item.Key, out _);
        }
    }

    private static bool IsDownloadFormat(string format)
    {
        return format is "svg" or "dxf" or "stl" or "package";
    }

    private IActionResult DownloadQuotaError(DownloadQuotaResult quota)
    {
        return StatusCode(quota.StatusCode, new DownloadLimitResponse(quota.Error ?? "Download unavailable.", quota.User));
    }

    private void QueueDownloadNotificationOnce(DownloadBundle bundle, string format, PublicUser? user)
    {
        if (!bundle.NotifiedFormats.TryAdd(format, 0))
            return;

        QueueDownloadNotification(bundle.Name, format, user);
    }

    private void QueueDownloadNotification(string name, string format, PublicUser? user)
    {
        var page = Request.Headers.Referer.ToString();
        if (string.IsNullOrWhiteSpace(page))
            page = $"{Request.Scheme}://{Request.Host}{Request.Path}{Request.QueryString}";

        _ = _emails.SendDownloadNotificationAsync(new DownloadNotification(name, format, user, page));
    }

    private sealed record DownloadBundle(string Name, string? UserId, GenerateResult Result, byte[]? RenderPng, DateTimeOffset ExpiresAt)
    {
        public ConcurrentDictionary<string, byte> NotifiedFormats { get; } = new();
    }

    public sealed record PrepareDownloadResponse(string Svg, string Dxf, string Stl, string Package, PublicUser? Usage);

    public sealed record SaveDownloadsResponse(
        string Folder,
        string Svg,
        string Dxf,
        string Stl,
        string Zip,
        PublicUser? Usage
    );

    public sealed record DownloadLimitResponse(string Message, PublicUser? Usage);

    [HttpGet("svg/{name}")]
    public IActionResult Svg(
        string name,
        int fontSize = 150,
        string font = "Arial",
        float lineY = 240,
        float lineThickness = 20,
        float spacing = -30)
    {
        var service = new MakerNamesService();

        var project = new NameProject
        {
            Text = name,
            FontName = font,
            FontSize = fontSize,
            UseBaseLine = true,
            BaseLineY = lineY,
            BaseLineThickness = lineThickness,
            LetterSpacing = spacing,
            Letters = new()
        };

        var result = service.Generate(project);

        return Content(result.Svg, "image/svg+xml");
    }

    [HttpGet("stl/{name}")]
    public IActionResult Stl(
        string name,
        int fontSize = 150,
        string font = "Arial",
        float lineY = 240,
        float lineThickness = 20,
        float spacing = -30)
    {
        var service = new MakerNamesService();

        var project = new NameProject
        {
            Text = name,
            FontName = font,
            FontSize = fontSize,
            UseBaseLine = true,
            BaseLineY = lineY,
            BaseLineThickness = lineThickness,
            LetterSpacing = spacing,
            Letters = new()
        };

        var result = service.Generate(project);

        return Content(result.Stl, "model/stl");
    }
}

public sealed record ApiError(string Message);
