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
    private const long MaxFontUploadBytes = 8L * 1024L * 1024L;
    private readonly IWebHostEnvironment _environment;

    public GenerateController(IWebHostEnvironment environment)
    {
        _environment = environment;
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

    [HttpPost("svg")]
    public IActionResult SvgPost([FromBody] NameProject project)
    {
        var service = new MakerNamesService();

        var result = service.Generate(project);

        return Content(result.Svg, "image/svg+xml");
    }

    [HttpPost("stl")]
    public IActionResult StlPost([FromBody] NameProject project)
    {
        var service = new MakerNamesService();

        var result = service.Generate(project);

        return Content(result.Stl, "model/stl");
    }

}

public sealed record ApiError(string Message);
