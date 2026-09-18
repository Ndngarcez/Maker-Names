using System.Drawing;
using System.Globalization;
using System.Text;
using MakerNames.Core.Geometry;
using MakerNames.Core.Models;

namespace MakerNames.Core.Generators;

public static class ImportedObjectRenderer
{
    public static bool HasObject(NameProject project)
    {
        return EnumerateObjects(project).Any(item =>
            !string.IsNullOrWhiteSpace(item.SvgInner) || item.Contours.Count > 0
        );
    }

    public static void AppendToSvg(StringBuilder svg, NameProject project)
    {
        foreach (ImportedObject item in EnumerateObjects(project))
            AppendObjectToSvg(svg, project, item);
    }

    public static List<List<PointF>> GetTransformedContours(NameProject project)
    {
        List<List<PointF>> result = new();

        foreach (ImportedObject item in EnumerateObjects(project))
            result.AddRange(GetTransformedContours(item));

        return result;
    }

    public static IEnumerable<(ImportedObject Item, List<List<PointF>> Contours)> GetTransformedObjectContours(NameProject project)
    {
        foreach (ImportedObject item in EnumerateObjects(project))
            yield return (item, GetTransformedContours(item));
    }

    public static List<List<PointF>> GetTransformedContours(ImportedObject item)
    {
        List<List<PointF>> result = new();

        foreach (List<ShapePoint> contour in item.Contours)
        {
            List<PointF> transformed = new();

            foreach (ShapePoint point in contour)
                transformed.Add(TransformPoint(item, point));

            transformed = GeometryUtils.RemoveRepeatedPoints(transformed);

            if (transformed.Count >= 2)
                result.Add(transformed);
        }

        return result;
    }

    private static void AppendObjectToSvg(StringBuilder svg, NameProject project, ImportedObject item)
    {
        string accessoryColor = NormalizeColor(string.IsNullOrWhiteSpace(item.Color)
            ? project.AccessoryColor
            : item.Color);
        string idAttribute = string.IsNullOrWhiteSpace(item.Id)
            ? ""
            : $@" data-accessory-id=""{System.Security.SecurityElement.Escape(item.Id)}""";

        if (IsSvg(item) && !string.IsNullOrWhiteSpace(item.SvgInner))
        {
            svg.AppendLine(
                @"  <g class=""imported-object""" +
                idAttribute +
                @" data-imported-type=""svg"" transform=""translate(" +
                item.X.ToString("0.###", CultureInfo.InvariantCulture) +
                " " +
                item.Y.ToString("0.###", CultureInfo.InvariantCulture) +
                ") rotate(" +
                item.Rotation.ToString("0.###", CultureInfo.InvariantCulture) +
                ") scale(" +
                item.Scale.ToString("0.###", CultureInfo.InvariantCulture) +
                @")"" style=""color: " +
                accessoryColor +
                @"; fill: " +
                accessoryColor +
                @";"">"
            );
            svg.AppendLine(item.SvgInner);
            svg.AppendLine(@"  </g>");
            return;
        }

        if (item.Contours.Count > 0)
            svg.AppendLine(@"  <g class=""imported-object""" + idAttribute + @" data-imported-type=""dxf"">");

        foreach (List<PointF> contour in GetTransformedContours(item))
        {
            if (contour.Count < 2)
                continue;

            StringBuilder d = new();
            d.AppendFormat(CultureInfo.InvariantCulture, "M {0:0.###} {1:0.###} ", contour[0].X, contour[0].Y);

            for (int i = 1; i < contour.Count; i++)
                d.AppendFormat(CultureInfo.InvariantCulture, "L {0:0.###} {1:0.###} ", contour[i].X, contour[i].Y);

            if (contour.Count > 2)
                d.Append("Z");

            if (contour.Count == 2)
                svg.AppendLine($@"  <path d=""{d}"" fill=""none"" stroke=""{accessoryColor}"" stroke-width=""2"" />");
            else
                svg.AppendLine($@"  <path d=""{d}"" fill=""{accessoryColor}"" stroke=""none"" />");
        }

        if (item.Contours.Count > 0)
            svg.AppendLine(@"  </g>");
    }

    private static IEnumerable<ImportedObject> EnumerateObjects(NameProject project)
    {
        if (project.ImportedObjects?.Count > 0)
            return project.ImportedObjects.Where(item =>
                !string.IsNullOrWhiteSpace(item.SvgInner) || item.Contours.Count > 0);

        return project.ImportedObject == null
            ? Enumerable.Empty<ImportedObject>()
            : new[] { project.ImportedObject }.Where(item =>
                !string.IsNullOrWhiteSpace(item.SvgInner) || item.Contours.Count > 0);
    }

    private static PointF TransformPoint(ImportedObject item, ShapePoint point)
    {
        float x = point.X * item.Scale;
        float y = (IsDxf(item) ? -point.Y : point.Y) * item.Scale;

        double rad = item.Rotation * Math.PI / 180.0;
        float cos = (float)Math.Cos(rad);
        float sin = (float)Math.Sin(rad);

        float rx = (x * cos) - (y * sin);
        float ry = (x * sin) + (y * cos);

        return new PointF(rx + item.X, ry + item.Y);
    }

    private static bool IsDxf(ImportedObject item)
    {
        return item.Type.Equals("dxf", StringComparison.OrdinalIgnoreCase);
    }

    private static bool IsSvg(ImportedObject item)
    {
        return item.Type.Equals("svg", StringComparison.OrdinalIgnoreCase);
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
}
