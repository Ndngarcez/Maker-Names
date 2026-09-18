using System.Drawing;
using System.Drawing.Drawing2D;
using System.Globalization;
using System.Text;
using MakerNames.Core.Geometry;
using MakerNames.Core.Models;

namespace MakerNames.Core.Generators;

internal static class PlacedNameRenderer
{
    public static void AppendToSvg(StringBuilder svg, NameProject project)
    {
        foreach (PlacedNameObject item in GetValidPlacedNames(project))
        {
            string color = NormalizeColor(item.PieceColor);
            string id = EscapeAttribute(string.IsNullOrWhiteSpace(item.Id) ? Guid.NewGuid().ToString("N") : item.Id);

            svg.AppendLine($@"  <g class=""placed-name-object"" data-placed-id=""{id}"">");

            RectangleF localBounds = GetLocalBounds(item);

            foreach (List<List<PointF>> letterContours in GetTransformedContourGroups(item, localBounds))
            {
                string d = string.Join(" ", letterContours.Select(PolygonToPathData).Where(value => !string.IsNullOrWhiteSpace(value)));
                if (!string.IsNullOrWhiteSpace(d))
                    svg.AppendLine($@"    <path class=""placed-name-path"" d=""{d}"" fill=""{color}"" fill-rule=""nonzero"" clip-rule=""nonzero"" />");
            }

            svg.AppendLine(@"  </g>");
        }
    }

    public static IEnumerable<List<List<PointF>>> GetTransformedContoursByName(NameProject project)
    {
        foreach (PlacedNameObject item in GetValidPlacedNames(project))
        {
            foreach (List<List<PointF>> contours in GetTransformedContourGroups(item))
                yield return contours;
        }
    }

    public static IEnumerable<List<PointF>> GetTransformedContours(NameProject project)
    {
        foreach (PlacedNameObject item in GetValidPlacedNames(project))
        {
            foreach (List<PointF> contour in GetTransformedContours(item))
                yield return contour;
        }
    }

    private static List<List<PointF>> GetTransformedContours(PlacedNameObject item)
    {
        return GetTransformedContourGroups(item)
            .SelectMany(contours => contours)
            .ToList();
    }

    private static List<List<List<PointF>>> GetTransformedContourGroups(PlacedNameObject item)
    {
        return GetTransformedContourGroups(item, GetLocalBounds(item));
    }

    private static List<List<List<PointF>>> GetTransformedContourGroups(PlacedNameObject item, RectangleF localBounds)
    {
        List<List<List<PointF>>> groups = new();

        if (localBounds.IsEmpty)
            return groups;

        foreach (LetterItem letter in GetLetters(item))
        {
            List<List<PointF>> result = new();
            using GraphicsPath path = CreateLetterPath(item, letter, localBounds, applyObjectTransform: false);
            if (path.PointCount == 0)
                continue;

            using GraphicsPath flatPath = (GraphicsPath)path.Clone();
            flatPath.Flatten(null, 0.5f);

            IEnumerable<List<PointF>> polygons = GeometryUtils.GetPolygonsFromPath(flatPath);

            if (item.UseBaseLine)
                polygons = polygons.Select(polygon => GeometryUtils.ClipPolygonAboveLine(polygon, item.BaseLineY));

            foreach (List<PointF> polygon in polygons)
            {
                List<PointF> transformed = polygon
                    .Where(point => NumberIsFinite(point.X) && NumberIsFinite(point.Y))
                    .Select(point => TransformPoint(point, localBounds, item))
                    .ToList();

                transformed = GeometryUtils.RemoveRepeatedPoints(transformed);

                if (transformed.Count >= 3)
                    result.Add(transformed);
            }

            if (result.Count > 0)
                groups.Add(OrientContoursForNonZero(result));
        }

        return groups;
    }

    private static List<List<PointF>> OrientContoursForNonZero(List<List<PointF>> contours)
    {
        List<List<PointF>> cleaned = contours
            .Select(GeometryUtils.RemoveRepeatedPoints)
            .Where(contour => contour.Count >= 3 && Math.Abs(GetSignedArea(contour)) > 0.01f)
            .ToList();

        List<List<PointF>> oriented = new();

        for (int i = 0; i < cleaned.Count; i++)
        {
            List<PointF> contour = cleaned[i];
            bool isHole = GetContainmentDepth(contour, cleaned, i) % 2 == 1;
            float area = GetSignedArea(contour);
            bool shouldBePositive = !isHole;
            List<PointF> output = new(contour);

            if ((area > 0) != shouldBePositive)
                output.Reverse();

            oriented.Add(output);
        }

        return oriented;
    }

    private static int GetContainmentDepth(List<PointF> contour, List<List<PointF>> contours, int contourIndex)
    {
        PointF testPoint = GetPolygonCentroid(contour);
        float contourArea = Math.Abs(GetSignedArea(contour));
        int depth = 0;

        for (int i = 0; i < contours.Count; i++)
        {
            if (i == contourIndex)
                continue;

            List<PointF> candidate = contours[i];
            float candidateArea = Math.Abs(GetSignedArea(candidate));

            if (candidateArea <= contourArea)
                continue;

            if (PointInPolygon(testPoint, candidate))
                depth++;
        }

        return depth;
    }

    private static RectangleF GetLocalBounds(PlacedNameObject item)
    {
        RectangleF? bounds = null;

        foreach (LetterItem letter in GetLetters(item))
        {
            using GraphicsPath path = CreateLetterPath(item, letter, RectangleF.Empty, applyObjectTransform: false);

            if (path.PointCount == 0)
                continue;

            RectangleF itemBounds = path.GetBounds();
            bounds = bounds.HasValue ? RectangleF.Union(bounds.Value, itemBounds) : itemBounds;
        }

        return bounds ?? RectangleF.Empty;
    }

    private static GraphicsPath CreateLetterPath(
        PlacedNameObject item,
        LetterItem letter,
        RectangleF localBounds,
        bool applyObjectTransform)
    {
        using Font font = FontRegistry.CreateFont(item.FontName, item.FontSize);

        GraphicsPath path = new();
        path.AddString(
            letter.Character.ToString(),
            font.FontFamily,
            (int)font.Style,
            font.Size * letter.Scale,
            new PointF(letter.X + letter.OffsetX, letter.Y + letter.OffsetY),
            StringFormat.GenericDefault
        );

        if (letter.Rotation != 0)
        {
            RectangleF bounds = path.GetBounds();

            using Matrix matrix = new();
            matrix.RotateAt(
                letter.Rotation,
                new PointF(bounds.X + bounds.Width / 2, bounds.Y + bounds.Height / 2)
            );
            path.Transform(matrix);
        }

        if (applyObjectTransform && !localBounds.IsEmpty)
        {
            using Matrix matrix = CreateObjectMatrix(localBounds, item);
            path.Transform(matrix);
        }

        return path;
    }

    private static Matrix CreateObjectMatrix(RectangleF localBounds, PlacedNameObject item)
    {
        float centerX = localBounds.X + localBounds.Width / 2;
        float centerY = localBounds.Y + localBounds.Height / 2;
        Matrix matrix = new();

        matrix.Translate(-centerX, -centerY, MatrixOrder.Append);
        matrix.Scale(item.Scale, item.Scale, MatrixOrder.Append);
        matrix.Rotate(item.Rotation, MatrixOrder.Append);
        matrix.Translate(centerX + item.X, centerY + item.Y, MatrixOrder.Append);

        return matrix;
    }

    private static PointF TransformPoint(PointF point, RectangleF localBounds, PlacedNameObject item)
    {
        float centerX = localBounds.X + localBounds.Width / 2;
        float centerY = localBounds.Y + localBounds.Height / 2;
        float x = (point.X - centerX) * item.Scale;
        float y = (point.Y - centerY) * item.Scale;
        double radians = item.Rotation * Math.PI / 180.0;
        float cos = (float)Math.Cos(radians);
        float sin = (float)Math.Sin(radians);

        return new PointF(
            x * cos - y * sin + centerX + item.X,
            x * sin + y * cos + centerY + item.Y
        );
    }

    private static IReadOnlyList<LetterItem> GetLetters(PlacedNameObject item)
    {
        if ((item.Letters?.Count ?? 0) > 0)
            return item.Letters!;

        List<LetterItem> letters = new();

        if (string.IsNullOrWhiteSpace(item.Text))
            return letters;

        using Bitmap bitmap = new(1, 1);
        using Graphics graphics = Graphics.FromImage(bitmap);
        using Font font = FontRegistry.CreateFont(item.FontName, item.FontSize);

        graphics.SmoothingMode = SmoothingMode.AntiAlias;

        float currentX = 50;
        float baseY = item.BaseLineY - item.FontSize * 0.78f;

        foreach (char character in item.Text)
        {
            using GraphicsPath tempPath = new();
            tempPath.AddString(character.ToString(), font.FontFamily, (int)font.Style, font.Size, new PointF(0, 0), StringFormat.GenericDefault);
            RectangleF bounds = tempPath.GetBounds();

            letters.Add(new LetterItem
            {
                Character = character,
                X = currentX,
                Y = baseY,
                Scale = 1
            });

            currentX += bounds.Width + item.LetterSpacing;
        }

        return letters;
    }

    private static IEnumerable<PlacedNameObject> GetValidPlacedNames(NameProject project)
    {
        return (project.PlacedNames ?? new List<PlacedNameObject>())
            .Where(item => item != null && ((item.Letters?.Count ?? 0) > 0 || !string.IsNullOrWhiteSpace(item.Text)))
            .Where(item => item.Scale > 0.01f);
    }

    private static float GetSignedArea(List<PointF> contour)
    {
        double area = 0;

        for (int i = 0; i < contour.Count; i++)
        {
            PointF a = contour[i];
            PointF b = contour[(i + 1) % contour.Count];
            area += (a.X * b.Y) - (b.X * a.Y);
        }

        return (float)(area / 2.0);
    }

    private static PointF GetPolygonCentroid(List<PointF> contour)
    {
        double area = 0;
        double cx = 0;
        double cy = 0;

        for (int i = 0; i < contour.Count; i++)
        {
            PointF a = contour[i];
            PointF b = contour[(i + 1) % contour.Count];
            double cross = (a.X * b.Y) - (b.X * a.Y);
            area += cross;
            cx += (a.X + b.X) * cross;
            cy += (a.Y + b.Y) * cross;
        }

        if (Math.Abs(area) < 0.0001)
            return contour[0];

        return new PointF((float)(cx / (3 * area)), (float)(cy / (3 * area)));
    }

    private static bool PointInPolygon(PointF point, List<PointF> polygon)
    {
        bool inside = false;

        for (int i = 0, j = polygon.Count - 1; i < polygon.Count; j = i++)
        {
            PointF a = polygon[i];
            PointF b = polygon[j];

            bool intersects = ((a.Y > point.Y) != (b.Y > point.Y)) &&
                point.X < ((b.X - a.X) * (point.Y - a.Y) / ((b.Y - a.Y) + 0.000001f)) + a.X;

            if (intersects)
                inside = !inside;
        }

        return inside;
    }

    private static string PolygonToPathData(List<PointF> contour)
    {
        contour = GeometryUtils.RemoveRepeatedPoints(contour);

        if (contour.Count < 3)
            return "";

        StringBuilder d = new();
        d.AppendFormat(CultureInfo.InvariantCulture, "M {0:0.###} {1:0.###} ", contour[0].X, contour[0].Y);

        for (int i = 1; i < contour.Count; i++)
            d.AppendFormat(CultureInfo.InvariantCulture, "L {0:0.###} {1:0.###} ", contour[i].X, contour[i].Y);

        d.Append("Z");
        return d.ToString();
    }

    private static string GraphicsPathToSvgPath(GraphicsPath path)
    {
        if (path.PointCount == 0)
            return "";

        StringBuilder d = new();
        PointF[] points = path.PathPoints;
        byte[] types = path.PathTypes;
        int i = 0;

        while (i < points.Length)
        {
            byte type = (byte)(types[i] & 0x07);
            bool close = (types[i] & 0x80) != 0;

            if (type == 0)
            {
                d.AppendFormat(CultureInfo.InvariantCulture, "M {0:0.###} {1:0.###} ", points[i].X, points[i].Y);
                i++;
            }
            else if (type == 1)
            {
                d.AppendFormat(CultureInfo.InvariantCulture, "L {0:0.###} {1:0.###} ", points[i].X, points[i].Y);
                i++;
            }
            else if (type == 3 && i + 2 < points.Length)
            {
                d.AppendFormat(
                    CultureInfo.InvariantCulture,
                    "C {0:0.###} {1:0.###} {2:0.###} {3:0.###} {4:0.###} {5:0.###} ",
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

            if (close)
                d.Append("Z ");
        }

        return d.ToString();
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

    private static string EscapeAttribute(string value)
    {
        return value
            .Replace("&", "&amp;", StringComparison.Ordinal)
            .Replace("\"", "&quot;", StringComparison.Ordinal)
            .Replace("<", "&lt;", StringComparison.Ordinal)
            .Replace(">", "&gt;", StringComparison.Ordinal);
    }

    private static string Format(float value)
    {
        return value.ToString("0.###", CultureInfo.InvariantCulture);
    }

    private static bool NumberIsFinite(float value)
    {
        return !float.IsNaN(value) && !float.IsInfinity(value);
    }
}
