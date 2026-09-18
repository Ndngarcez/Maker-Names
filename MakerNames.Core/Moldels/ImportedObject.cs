namespace MakerNames.Core.Models;

public class ImportedObject
{
    public string Id { get; set; } = "";

    public string Name { get; set; } = "";

    public string Type { get; set; } = "";

    public string SourceKind { get; set; } = "";

    public string StlMode { get; set; } = "";

    public string Color { get; set; } = "";

    public string SvgInner { get; set; } = "";

    public List<List<ShapePoint>> Contours { get; set; } = new();

    public float X { get; set; } = 250;

    public float Y { get; set; } = 120;

    public float Rotation { get; set; } = 0;

    public float Scale { get; set; } = 0.3f;
}

public class ShapePoint
{
    public float X { get; set; }

    public float Y { get; set; }
}
