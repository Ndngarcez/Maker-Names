using System.Text.Json;

namespace MakerNames.Api.Services;

public sealed class DownloadLibraryStore
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    private readonly string _libraryRootPath;
    private readonly string _filesRootPath;
    private readonly string _manifestPath;

    public DownloadLibraryStore(IWebHostEnvironment environment)
    {
        _libraryRootPath = Path.Combine(environment.ContentRootPath, "DownloadLibrary");
        _filesRootPath = Path.Combine(_libraryRootPath, "files");
        _manifestPath = Path.Combine(_libraryRootPath, "library.json");
    }

    public async Task<IReadOnlyList<DownloadLibraryItem>> ListAsync(int take = 80)
    {
        var data = await LoadManifestAsync();
        return data.Items
            .OrderBy(item => item.Title, StringComparer.CurrentCultureIgnoreCase)
            .Take(Math.Clamp(take, 1, 200))
            .Select(Clone)
            .ToList();
    }

    public async Task<DownloadLibraryItem?> GetAsync(string slug)
    {
        if (string.IsNullOrWhiteSpace(slug))
            return null;

        var data = await LoadManifestAsync();
        var item = data.Items.FirstOrDefault(candidate =>
            string.Equals(candidate.Slug, slug, StringComparison.OrdinalIgnoreCase));

        return item == null ? null : Clone(item);
    }

    public string GetFilesPath(DownloadLibraryItem item)
    {
        var fullPath = Path.GetFullPath(Path.Combine(_filesRootPath, item.Slug));
        var filesRoot = Path.GetFullPath(_filesRootPath);

        if (!fullPath.StartsWith(filesRoot, StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException("Invalid library path.");

        return fullPath;
    }

    private async Task<DownloadLibraryManifest> LoadManifestAsync()
    {
        if (!File.Exists(_manifestPath))
            return new DownloadLibraryManifest();

        await using var stream = File.OpenRead(_manifestPath);
        return await JsonSerializer.DeserializeAsync<DownloadLibraryManifest>(stream, JsonOptions)
            ?? new DownloadLibraryManifest();
    }

    private static DownloadLibraryItem Clone(DownloadLibraryItem item)
    {
        return new DownloadLibraryItem
        {
            Slug = item.Slug,
            Title = item.Title,
            PreviewUrl = item.PreviewUrl,
            PageUrl = item.PageUrl,
            DownloadUrl = item.DownloadUrl,
            Formats = item.Formats.ToList(),
            FileCount = item.FileCount
        };
    }
}

public sealed class DownloadLibraryManifest
{
    public List<DownloadLibraryItem> Items { get; set; } = [];
}

public sealed class DownloadLibraryItem
{
    public string Slug { get; set; } = "";
    public string Title { get; set; } = "";
    public string PreviewUrl { get; set; } = "";
    public string PageUrl { get; set; } = "";
    public string DownloadUrl { get; set; } = "";
    public List<string> Formats { get; set; } = [];
    public int FileCount { get; set; }
}
