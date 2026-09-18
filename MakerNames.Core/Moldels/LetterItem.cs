namespace MakerNames.Core.Models;

public class LetterItem
{
    public char Character { get; set; }

    public float X { get; set; }

    public float Y { get; set; }

    public float OffsetX { get; set; } = 0;

    public float OffsetY { get; set; } = 0;

    public float Rotation { get; set; } = 0;

    public float Scale { get; set; } = 1;
}