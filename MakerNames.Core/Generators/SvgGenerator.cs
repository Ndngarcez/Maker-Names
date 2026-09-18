using System.Drawing;
using System.Drawing.Drawing2D;
using System.Globalization;
using System.Text;
using MakerNames.Core.Models;

namespace MakerNames.Core.Generators;

public class SvgGenerator
{
    public string Generate(NameProject project)
    {
        float svgWidth = 1200;
        float svgHeight = 600;

        RectangleF contentBounds = GetContentBounds(project);
        float lineX = contentBounds.IsEmpty ? 20 : Math.Max(0, contentBounds.Left - 8);
        float lineWidth = contentBounds.IsEmpty ? 200 : Math.Max(40, contentBounds.Width + 16);
        float cutY = project.BaseLineY;
        string cutYText = cutY.ToString("0.###", CultureInfo.InvariantCulture);
        string pieceColor = NormalizeColor(project.PieceColor);

        StringBuilder svg = new();

        svg.AppendLine(@"<?xml version=""1.0"" encoding=""UTF-8""?>");
        svg.AppendLine($@"<svg xmlns=""http://www.w3.org/2000/svg"" width=""{svgWidth}"" height=""{svgHeight}"" viewBox=""0 0 {svgWidth} {svgHeight}"">");
        svg.AppendLine(@"  <style>");
        svg.AppendLine($@"    .letter-path {{ fill: {pieceColor}; }}");
        svg.AppendLine(@"    .placed-name-object { cursor: move; }");
        svg.AppendLine(@"    .imported-object path:not([fill=""none""]), .imported-object polygon:not([fill=""none""]), .imported-object rect:not([fill=""none""]), .imported-object circle:not([fill=""none""]), .imported-object ellipse:not([fill=""none""]) { fill: currentColor !important; }");
        svg.AppendLine(@"    .imported-object path[stroke]:not([stroke=""none""]), .imported-object polygon[stroke]:not([stroke=""none""]), .imported-object rect[stroke]:not([stroke=""none""]), .imported-object circle[stroke]:not([stroke=""none""]), .imported-object ellipse[stroke]:not([stroke=""none""]) { stroke: currentColor !important; }");
        svg.AppendLine(@"  </style>");

        PlacedNameRenderer.AppendToSvg(svg, project);

        if (project.UseBaseLine)
        {
            svg.AppendLine(@"  <defs>");
            svg.AppendLine(@"    <clipPath id=""corteLinhaBase"">");

            // Área grande para não cortar letras erradamente
            svg.AppendLine($@"      <rect x=""0"" y=""0"" width=""{svgWidth}"" height=""{cutYText}"" />");

            svg.AppendLine(@"    </clipPath>");
            svg.AppendLine(@"  </defs>");
            svg.AppendLine(@"  <g clip-path=""url(#corteLinhaBase)"">");
        }

        foreach (var item in project.Letters)
        {
            using GraphicsPath path = CreateLetterPath(project, item);

            if (path.PointCount == 0)
                continue;

            string pathData = GraphicsPathToSvgPath(path);

            if (!string.IsNullOrWhiteSpace(pathData))
            {
                string indent = project.UseBaseLine ? "    " : "  ";
                svg.AppendLine(indent + $@"<path class=""letter-path"" d=""{pathData}"" fill=""{pieceColor}"" />");
            }
        }

        if (project.UseBaseLine)
            svg.AppendLine(@"  </g>");

        if (project.UseBaseLine && project.ShowBaseLine)
        {
            svg.AppendLine(
                $@"  <line x1=""{lineX.ToString("0.###", CultureInfo.InvariantCulture)}"" y1=""{project.BaseLineY.ToString("0.###", CultureInfo.InvariantCulture)}"" x2=""{(lineX + lineWidth).ToString("0.###", CultureInfo.InvariantCulture)}"" y2=""{project.BaseLineY.ToString("0.###", CultureInfo.InvariantCulture)}"" stroke=""#e11d48"" stroke-width=""1.2"" />"
            );
        }

        ImportedObjectRenderer.AppendToSvg(svg, project);

        svg.AppendLine("</svg>");

        return svg.ToString();
    }

    private static string NormalizeColor(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return "#111111";

        string color = value.Trim();

        if (System.Text.RegularExpressions.Regex.IsMatch(color, "^#[0-9a-fA-F]{6}$"))
            return color.ToLowerInvariant();

        if (System.Text.RegularExpressions.Regex.IsMatch(color, "^#[0-9a-fA-F]{3}$"))
            return "#" + string.Concat(color.Skip(1).Select(ch => $"{ch}{ch}")).ToLowerInvariant();

        return "#111111";
    }

    private RectangleF GetContentBounds(NameProject project)
    {
        RectangleF? bounds = null;

        foreach (var item in project.Letters)
        {
            using GraphicsPath path = CreateLetterPath(project, item);

            if (path.PointCount == 0)
                continue;

            RectangleF itemBounds = path.GetBounds();
            bounds = bounds.HasValue ? RectangleF.Union(bounds.Value, itemBounds) : itemBounds;
        }

        return bounds ?? RectangleF.Empty;
    }

    private GraphicsPath CreateLetterPath(NameProject project, LetterItem item)
    {
        using Font font = FontRegistry.CreateFont(project.FontName, project.FontSize * item.Scale);

        GraphicsPath path = new();

        path.AddString(
            item.Character.ToString(),
            font.FontFamily,
            (int)font.Style,
            font.Size,
            new PointF(
                item.X + item.OffsetX,
                item.Y + item.OffsetY
            ),
            StringFormat.GenericDefault
        );

        if (item.Rotation != 0)
        {
            RectangleF bounds = path.GetBounds();

            using Matrix matrix = new();

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

    public string GraphicsPathToSvgPath(GraphicsPath path)
    {
        if (path == null || path.PointCount == 0)
            return "";

        StringBuilder d = new();
        var points = path.PathPoints;
        var types = path.PathTypes;
        int i = 0;

        while (i < points.Length)
        {
            byte type = (byte)(types[i] & 0x07);
            bool close = (types[i] & 0x80) != 0;

            if (type == 0)
            {
                d.AppendFormat(
                    CultureInfo.InvariantCulture,
                    "M {0:0.###} {1:0.###} ",
                    points[i].X,
                    points[i].Y
                );

                i++;
            }
            else if (type == 1)
            {
                d.AppendFormat(
                    CultureInfo.InvariantCulture,
                    "L {0:0.###} {1:0.###} ",
                    points[i].X,
                    points[i].Y
                );

                i++;
            }
            else if (type == 3)
            {
                if (i + 2 < points.Length)
                {
                    d.AppendFormat(
                        CultureInfo.InvariantCulture,
                        "C {0:0.###} {1:0.###}, {2:0.###} {3:0.###}, {4:0.###} {5:0.###} ",
                        points[i].X,
                        points[i].Y,
                        points[i + 1].X,
                        points[i + 1].Y,
                        points[i + 2].X,
                        points[i + 2].Y
                    );

                    i += 3;
                }
                else
                {
                    i++;
                }
            }
            else
            {
                i++;
            }

            if (close)
                d.Append("Z ");
        }

        return d.ToString();
    }
}
