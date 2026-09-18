using System.Drawing;
using System.Drawing.Text;

namespace MakerNames.Core.Generators;

public static class FontRegistry
{
    private static readonly object Sync = new();
    private static PrivateFontCollection? _privateFonts;
    private static string? _fontsPath;

    public static void Configure(string? fontsPath)
    {
        lock (Sync)
        {
            _fontsPath = fontsPath;
            _privateFonts?.Dispose();
            _privateFonts = null;
        }
    }

    public static void Reload()
    {
        lock (Sync)
        {
            _privateFonts?.Dispose();
            _privateFonts = null;
        }
    }

    public static IReadOnlyList<CustomFontInfo> GetCustomFonts()
    {
        EnsureLoaded();

        lock (Sync)
        {
            if (_privateFonts == null || string.IsNullOrWhiteSpace(_fontsPath))
                return [];

            return Directory
                .EnumerateFiles(_fontsPath)
                .Where(IsFontFile)
                .SelectMany(file => GetFamiliesForFile(file)
                    .Select(name => new CustomFontInfo(name, Path.GetFileName(file), IsImportedFont(file))))
                .GroupBy(font => font.Name, StringComparer.OrdinalIgnoreCase)
                .Select(group => group.First())
                .OrderBy(font => font.Name)
                .ToList();
        }
    }

    public static IReadOnlyList<string> ReadFontFamilyNames(string file)
    {
        return GetFamiliesForFile(file).ToList();
    }

    public static Font CreateFont(string fontName, float fontSize)
    {
        EnsureLoaded();

        lock (Sync)
        {
            var family = _privateFonts?.Families.FirstOrDefault(item =>
                string.Equals(item.Name, fontName, StringComparison.OrdinalIgnoreCase));

            if (family != null)
                return new Font(family, fontSize, FontStyle.Regular, GraphicsUnit.Pixel);
        }

        return new Font(fontName, fontSize, FontStyle.Regular, GraphicsUnit.Pixel);
    }

    private static void EnsureLoaded()
    {
        lock (Sync)
        {
            if (_privateFonts != null)
                return;

            _privateFonts = new PrivateFontCollection();

            if (string.IsNullOrWhiteSpace(_fontsPath) || !Directory.Exists(_fontsPath))
                return;

            foreach (var file in Directory.EnumerateFiles(_fontsPath).Where(IsFontFile))
            {
                try
                {
                    _privateFonts.AddFontFile(file);
                }
                catch
                {
                    // Ignore damaged or unsupported font files and keep the rest available.
                }
            }
        }
    }

    private static IEnumerable<string> GetFamiliesForFile(string file)
    {
        using PrivateFontCollection collection = new();

        try
        {
            collection.AddFontFile(file);
        }
        catch
        {
            yield break;
        }

        foreach (var family in collection.Families)
            yield return family.Name;
    }

    public static bool IsFontFile(string file)
    {
        var extension = Path.GetExtension(file);
        return extension.Equals(".ttf", StringComparison.OrdinalIgnoreCase)
            || extension.Equals(".otf", StringComparison.OrdinalIgnoreCase);
    }

    private static bool IsImportedFont(string file)
    {
        return Path.GetFileName(file).StartsWith("user-", StringComparison.OrdinalIgnoreCase);
    }
}

public sealed record CustomFontInfo(string Name, string File, bool Imported);
