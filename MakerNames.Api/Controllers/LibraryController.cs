using System.IO.Compression;
using MakerNames.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace MakerNames.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class LibraryController : ControllerBase
{
    private readonly DownloadLibraryStore _library;

    public LibraryController(DownloadLibraryStore library)
    {
        _library = library;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DownloadLibraryItem>>> List([FromQuery] int take = 80)
    {
        return Ok(await _library.ListAsync(take));
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<DownloadLibraryItem>> Details(string slug)
    {
        var item = await _library.GetAsync(slug);
        return item == null ? NotFound(new LibraryMessageResponse("Library item not found.")) : Ok(item);
    }

    [HttpGet("{slug}/download")]
    public async Task<IActionResult> Download(string slug)
    {
        var item = await _library.GetAsync(slug);
        if (item == null)
            return NotFound(new LibraryMessageResponse("Library item not found."));

        var filesPath = _library.GetFilesPath(item);
        if (!Directory.Exists(filesPath))
            return NotFound(new LibraryMessageResponse("Library files are not available."));

        var files = Directory.EnumerateFiles(filesPath, "*", SearchOption.AllDirectories)
            .Where(path => !Path.GetFileName(path).StartsWith(".", StringComparison.Ordinal))
            .OrderBy(path => path, StringComparer.OrdinalIgnoreCase)
            .ToList();

        if (files.Count == 0)
            return NotFound(new LibraryMessageResponse("Library files are not available."));

        await using var output = new MemoryStream();
        using (var archive = new ZipArchive(output, ZipArchiveMode.Create, leaveOpen: true))
        {
            foreach (var file in files)
            {
                var relativePath = Path.GetRelativePath(filesPath, file).Replace('\\', '/');
                archive.CreateEntryFromFile(file, relativePath, CompressionLevel.Fastest);
            }
        }

        return File(output.ToArray(), "application/zip", $"{item.Slug}-makernames-pack.zip");
    }
}

public sealed record LibraryMessageResponse(string Message);
