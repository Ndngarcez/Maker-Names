using System.Drawing;
using System.Drawing.Drawing2D;
using MakerNames.Core.Models;

namespace MakerNames.Core.Generators;

public class NameEngine
{
    public Font CreateFont(string fontName, float fontSize)
    {
        return FontRegistry.CreateFont(fontName, fontSize);
    }

    public GraphicsPath CreateLetterPath(
        NameProject project,
        Font font,
        LetterItem item)
    {
        GraphicsPath path = new();

        path.AddString(
            item.Character.ToString(),
            font.FontFamily,
            (int)font.Style,
            font.Size * item.Scale,
            new PointF(
                item.X + item.OffsetX,
                item.Y + item.OffsetY
            ),
            StringFormat.GenericDefault
        );

        // Rotação individual
        if (item.Rotation != 0)
        {
            RectangleF bounds = path.GetBounds();

            Matrix matrix = new();

            matrix.RotateAt(
                item.Rotation,
                new PointF(
                    bounds.X + bounds.Width / 2,
                    bounds.Y + bounds.Height / 2
                )
            );

            path.Transform(matrix);
        }

        return path;
    }

    public List<LetterItem> GenerateLetters(NameProject project)
    {
        List<LetterItem> letters = new();

        using Bitmap bmp = new(1, 1);
        using Graphics g = Graphics.FromImage(bmp);

        g.SmoothingMode = SmoothingMode.AntiAlias;

        using Font font = CreateFont(project.FontName, project.FontSize);

        float currentX = 50;

        // Base alinhada com a linha
        float baseY = project.BaseLineY - project.FontSize * 0.78f;

        foreach (char c in project.Text)
        {
            using GraphicsPath tempPath = new();

            tempPath.AddString(
                c.ToString(),
                font.FontFamily,
                (int)font.Style,
                font.Size,
                new PointF(0, 0),
                StringFormat.GenericDefault
            );

            RectangleF bounds = tempPath.GetBounds();

            LetterItem item = new()
            {
                Character = c,
                X = currentX,
                Y = baseY,

                OffsetX = 0,
                OffsetY = 0,

                Rotation = 0,
                Scale = 1
            };

            letters.Add(item);

            currentX += bounds.Width + project.LetterSpacing;
        }

        return letters;
    }
}
