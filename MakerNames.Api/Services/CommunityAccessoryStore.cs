using System.Text.Json;

namespace MakerNames.Api.Services;

public sealed class CommunityAccessoryStore
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        WriteIndented = true
    };

    private readonly SemaphoreSlim _gate = new(1, 1);
    private readonly string _filePath;

    public CommunityAccessoryStore(IWebHostEnvironment environment)
    {
        _filePath = Path.Combine(environment.ContentRootPath, "App_Data", "community-accessories.json");
    }

    public async Task<IReadOnlyList<CommunityAccessoryItem>> ListAsync(int take)
    {
        await _gate.WaitAsync();
        try
        {
            var data = await LoadDataCoreAsync();
            return data.Items
                .OrderByDescending(item => item.Verified3d)
                .ThenByDescending(item => item.Uses)
                .ThenByDescending(item => item.CreatedAt)
                .Take(Math.Clamp(take, 1, 240))
                .Select(ClonePublicItem)
                .ToList();
        }
        finally
        {
            _gate.Release();
        }
    }

    public async Task<CommunityAccessoryItem?> GetAsync(string id)
    {
        await _gate.WaitAsync();
        try
        {
            var data = await LoadDataCoreAsync();
            var item = data.Items.FirstOrDefault(candidate => candidate.Id == id);
            return item == null ? null : ClonePublicItem(item);
        }
        finally
        {
            _gate.Release();
        }
    }

    public async Task<CommunityAccessoryItem> AddAsync(CommunityAccessoryItem item)
    {
        await _gate.WaitAsync();
        try
        {
            var data = await LoadDataCoreAsync();
            var existing = data.Items.FirstOrDefault(candidate => candidate.Hash == item.Hash);
            if (existing != null)
            {
                existing.Uses += 1;
                existing.LastUsedAt = DateTimeOffset.UtcNow;

                if (item.Verified3d && !existing.Verified3d)
                {
                    existing.Verified3d = true;
                    existing.StlRisk = "safe";
                    existing.StlIssues = [];
                }

                await SaveDataCoreAsync(data);
                return ClonePublicItem(existing);
            }

            data.Items.Add(item);

            if (data.Items.Count > 600)
            {
                data.Items = data.Items
                    .OrderByDescending(candidate => candidate.Verified3d)
                    .ThenByDescending(candidate => candidate.Uses)
                    .ThenByDescending(candidate => candidate.CreatedAt)
                    .Take(600)
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

    private async Task<CommunityAccessoryData> LoadDataCoreAsync()
    {
        if (!File.Exists(_filePath))
            return new CommunityAccessoryData();

        await using var stream = File.OpenRead(_filePath);
        return await JsonSerializer.DeserializeAsync<CommunityAccessoryData>(stream, JsonOptions)
            ?? new CommunityAccessoryData();
    }

    private async Task SaveDataCoreAsync(CommunityAccessoryData data)
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

    private static CommunityAccessoryItem ClonePublicItem(CommunityAccessoryItem item)
    {
        return new CommunityAccessoryItem
        {
            Id = item.Id,
            Name = item.Name,
            Category = item.Category,
            SvgText = item.SvgText,
            Hash = item.Hash,
            AuthorName = item.AuthorName,
            AuthorUserId = item.AuthorUserId,
            StlRisk = item.StlRisk,
            StlIssues = [.. item.StlIssues],
            StlNodes = item.StlNodes,
            Verified3d = item.Verified3d,
            Scale = item.Scale,
            Uses = item.Uses,
            CreatedAt = item.CreatedAt,
            LastUsedAt = item.LastUsedAt
        };
    }
}

public sealed class CommunityAccessoryData
{
    public List<CommunityAccessoryItem> Items { get; set; } = [];
}

public sealed class CommunityAccessoryItem
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Category { get; set; } = "";
    public string SvgText { get; set; } = "";
    public string Hash { get; set; } = "";
    public string AuthorName { get; set; } = "";
    public string AuthorUserId { get; set; } = "";
    public string StlRisk { get; set; } = "review";
    public List<string> StlIssues { get; set; } = [];
    public int StlNodes { get; set; }
    public bool Verified3d { get; set; }
    public float Scale { get; set; } = 0.34f;
    public int Uses { get; set; } = 1;
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset LastUsedAt { get; set; }
}
