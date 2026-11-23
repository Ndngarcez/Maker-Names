using System.Text.Json;

namespace MakerNames.Api.Services;

public sealed class CommunityStore
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        WriteIndented = true
    };

    private readonly SemaphoreSlim _gate = new(1, 1);
    private readonly string _filePath;

    public CommunityStore(IWebHostEnvironment environment)
    {
        _filePath = Path.Combine(environment.ContentRootPath, "App_Data", "community.json");
    }

    public async Task<IReadOnlyList<CommunityItem>> ListAsync(int take, string sort)
    {
        await _gate.WaitAsync();
        try
        {
            var data = await LoadDataCoreAsync();
            return SortItems(data.Items, sort)
                .Take(Math.Clamp(take, 1, 60))
                .Select(ClonePublicItem)
                .ToList();
        }
        finally
        {
            _gate.Release();
        }
    }

    public async Task<CommunityItem> AddAsync(CommunityItem item)
    {
        await _gate.WaitAsync();
        try
        {
            var data = await LoadDataCoreAsync();
            data.Items.Add(item);

            if (data.Items.Count > 400)
            {
                data.Items = SortItems(data.Items, "top")
                    .Take(400)
                    .ToList();
            }

            await SaveDataCoreAsync(data);
            return ClonePublicItem(item);
        }
        finally
        {
            _gate.Release();
        }
    }

    public async Task<CommunityLikeResult?> ToggleLikeAsync(string id, string likerId)
    {
        await _gate.WaitAsync();
        try
        {
            var data = await LoadDataCoreAsync();
            var item = data.Items.FirstOrDefault(candidate => candidate.Id == id);
            if (item == null)
                return null;

            var liked = !item.LikedBy.Contains(likerId);
            if (liked)
                item.LikedBy.Add(likerId);
            else
                item.LikedBy.Remove(likerId);

            item.Likes = item.LikedBy.Count;
            await SaveDataCoreAsync(data);

            return new CommunityLikeResult(item.Id, item.Likes, liked);
        }
        finally
        {
            _gate.Release();
        }
    }

    private static IEnumerable<CommunityItem> SortItems(IEnumerable<CommunityItem> items, string sort)
    {
        return sort.ToLowerInvariant() switch
        {
            "recent" => items
                .OrderByDescending(item => item.CreatedAt)
                .ThenByDescending(item => item.Likes),
            "trending" => items
                .OrderByDescending(item => item.LastDownloadAt)
                .ThenByDescending(item => item.Likes)
                .ThenByDescending(item => item.Downloads),
            _ => items
                .OrderByDescending(item => item.Likes)
                .ThenByDescending(item => item.Downloads)
                .ThenByDescending(item => item.CreatedAt)
        };
    }

    private async Task<CommunityData> LoadDataCoreAsync()
    {
        if (!File.Exists(_filePath))
            return new CommunityData();

        await using var stream = File.OpenRead(_filePath);
        return await JsonSerializer.DeserializeAsync<CommunityData>(stream, JsonOptions)
            ?? new CommunityData();
    }

    private async Task SaveDataCoreAsync(CommunityData data)
    {
        Directory.CreateDirectory(Path.GetDirectoryName(_filePath)!);

        var tempPath = $"{_filePath}.tmp";
        await using (var stream = File.Create(tempPath))
        {
            await JsonSerializer.SerializeAsync(stream, data, JsonOptions);
        }

        if (File.Exists(_filePath))
            File.Delete(_filePath);

        File.Move(tempPath, _filePath);
    }

    private static CommunityItem ClonePublicItem(CommunityItem item)
    {
        return new CommunityItem
        {
            Id = item.Id,
            Title = item.Title,
            Slug = item.Slug,
            AuthorName = item.AuthorName,
            AuthorUserId = item.AuthorUserId,
            ThumbnailSvg = item.ThumbnailSvg,
            ThumbnailPng = item.ThumbnailPng,
            ProjectJson = item.ProjectJson,
            Likes = item.Likes,
            Downloads = item.Downloads,
            CreatedAt = item.CreatedAt,
            LastDownloadAt = item.LastDownloadAt,
            LikedBy = new HashSet<string>(item.LikedBy)
        };
    }
}

public sealed class CommunityData
{
    public List<CommunityItem> Items { get; set; } = [];
}

public sealed class CommunityItem
{
    public string Id { get; set; } = "";
    public string Title { get; set; } = "";
    public string Slug { get; set; } = "";
    public string AuthorName { get; set; } = "";
    public string AuthorUserId { get; set; } = "";
    public string ThumbnailSvg { get; set; } = "";
    public string ThumbnailPng { get; set; } = "";
    public string ProjectJson { get; set; } = "";
    public int Likes { get; set; }
    public int Downloads { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset LastDownloadAt { get; set; }
    public HashSet<string> LikedBy { get; set; } = [];
}

public sealed record CommunityLikeResult(string Id, int Likes, bool Liked);
