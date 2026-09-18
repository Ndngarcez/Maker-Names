using System.Drawing;
using System.Drawing.Drawing2D;
using System.Globalization;
using System.Text;
using MakerNames.Core.Geometry;
using MakerNames.Core.Models;

namespace MakerNames.Core.Generators;

public class DxfGenerator
{
    private readonly NameEngine _engine = new();

    public string Generate(NameProject project)
    {
        StringBuilder dxf = new();

        dxf.AppendLine("0");
        dxf.AppendLine("SECTION");
        dxf.AppendLine("2");
        dxf.AppendLine("ENTITIES");

        using var font = _engine.CreateFont(project.FontName, project.FontSize);

        foreach (var item in project.Letters)
        {
            using GraphicsPath path = _engine.CreateLetterPath(project, font, item);

            if (path.PointCount == 0)
                continue;

            using GraphicsPath flatPath = (GraphicsPath)path.Clone();
            flatPath.Flatten(null, 0.5f);

            if (project.UseBaseLine)
                AddGraphicsPathClippedToDxf(dxf, flatPath, GetCutY(project));
            else
                AddGraphicsPathToDxf(dxf, flatPath);
        }

        foreach (List<PointF> contour in ImportedObjectRenderer.GetTransformedContours(project))
        {
            if (contour.Count >= 2)
                WriteDxfPolyline(dxf, contour, true);
        }

        foreach (List<PointF> contour in PlacedNameRenderer.GetTransformedContours(project))
        {
            if (contour.Count >= 2)
                WriteDxfPolyline(dxf, contour, true);
        }

        dxf.AppendLine("0");
        dxf.AppendLine("ENDSEC");
        dxf.AppendLine("0");
        dxf.AppendLine("EOF");

        return dxf.ToString();
    }

    private void AddGraphicsPathToDxf(StringBuilder dxf, GraphicsPath path)
    {
        foreach (List<PointF> polygon in GeometryUtils.GetPolygonsFromPath(path))
            WriteDxfPolyline(dxf, polygon, true);
    }

    private void AddGraphicsPathClippedToDxf(StringBuilder dxf, GraphicsPath path, float cutY)
    {
        foreach (List<PointF> polygon in GeometryUtils.GetPolygonsFromPath(path))
        {
            List<PointF> clipped = GeometryUtils.ClipPolygonAboveLine(polygon, cutY);

            if (clipped.Count >= 3)
                WriteDxfPolyline(dxf, clipped, true);
        }
    }

    private void WriteDxfPolyline(StringBuilder dxf, List<PointF> points, bool closed)
    {
        points = GeometryUtils.RemoveRepeatedPoints(points);

        if (points.Count < 2)
            return;

        dxf.AppendLine("0");
        dxf.AppendLine("LWPOLYLINE");
        dxf.AppendLine("8");
        dxf.AppendLine("0");
        dxf.AppendLine("90");
        dxf.AppendLine(points.Count.ToString(CultureInfo.InvariantCulture));
        dxf.AppendLine("70");
        dxf.AppendLine(closed ? "1" : "0");

        foreach (PointF point in points)
        {
            dxf.AppendLine("10");
            dxf.AppendLine(point.X.ToString("0.###", CultureInfo.InvariantCulture));
            dxf.AppendLine("20");
            dxf.AppendLine((-point.Y).ToString("0.###", CultureInfo.InvariantCulture));
        }
    }

    private static float GetCutY(NameProject project)
    {
        return project.BaseLineY;
    }
}
