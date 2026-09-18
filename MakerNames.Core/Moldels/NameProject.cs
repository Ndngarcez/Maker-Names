namespace MakerNames.Core.Models;

public class NameProject
{
    public string Text { get; set; } = "";
    public string FontName { get; set; } = "Arial";
    public float FontSize { get; set; } = 150;
    public float LetterSpacing { get; set; } = 1.0f;

    public bool UseBaseLine { get; set; } = true;
    public bool ShowBaseLine { get; set; } = true;
    public float BaseLineY { get; set; } = 240;
    public float BaseLineThickness { get; set; } = 20;
    public string PieceColor { get; set; } = "#111111";
    public string AccessoryColor { get; set; } = "#111111";

    public List<LetterItem> Letters { get; set; } = new();

    public List<PlacedNameObject> PlacedNames { get; set; } = new();

    public ImportedObject? ImportedObject { get; set; }

    public List<ImportedObject> ImportedObjects { get; set; } = new();

    public string? RenderPngDataUrl { get; set; }
}

public class PlacedNameObject
{
    public string Id { get; set; } = "";

    public string Text { get; set; } = "";

    public string FontName { get; set; } = "Arial";

    public float FontSize { get; set; } = 150;

    public float LetterSpacing { get; set; } = 1.0f;

    public bool UseBaseLine { get; set; } = true;

    public bool ShowBaseLine { get; set; } = true;

    public float BaseLineY { get; set; } = 240;

    public float BaseLineThickness { get; set; } = 20;

    public string PieceColor { get; set; } = "#111111";

    public float X { get; set; } = 0;

    public float Y { get; set; } = 0;

    public float Rotation { get; set; } = 0;

    public float Scale { get; set; } = 1;

    public List<LetterItem> Letters { get; set; } = new();
}
