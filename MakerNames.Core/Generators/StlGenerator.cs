using System.Drawing;
using System.Drawing.Drawing2D;
using System.Globalization;
using System.Text;
using LibTessDotNet;
using MakerNames.Core.Geometry;
using MakerNames.Core.Models;

namespace MakerNames.Core.Generators;

public class StlGenerator
{
    private readonly NameEngine _engine = new();

    public float Thickness { get; set; } = 5.0f;

    public string Generate(NameProject project)
    {
        StringBuilder stl = new();

        stl.AppendLine("solid makernames");

        using var font = _engine.CreateFont(project.FontName, project.FontSize);

        foreach (var item in project.Letters)
        {
            using GraphicsPath path = _engine.CreateLetterPath(project, font, item);

            if (path.PointCount == 0)
                continue;

            using GraphicsPath flatPath = (GraphicsPath)path.Clone();
            flatPath.Flatten(null, 0.5f);

            List<List<PointF>> contours = GeometryUtils.GetPolygonsFromPath(flatPath)
                .Select(polygon => project.UseBaseLine
                    ? GeometryUtils.ClipPolygonAboveLine(polygon, GetCutY(project))
                    : polygon)
                .ToList();

            WriteContoursAsStl(stl, contours);
        }

        foreach (List<List<PointF>> contours in PlacedNameRenderer.GetTransformedContoursByName(project))
            WriteContoursAsStl(stl, contours, windingRule: WindingRule.NonZero);

        foreach ((ImportedObject item, List<List<PointF>> contours) in ImportedObjectRenderer.GetTransformedObjectContours(project))
        {
            string stlMode = GetImportedObjectStlMode(item);

            if (stlMode == "cookie-cutter")
                WriteCookieCutterContoursAsStl(stl, contours);
            else if (stlMode == "line-art")
                WriteLineArtContoursAsStl(stl, contours);
            else if (stlMode == "silhouette")
                WriteSilhouetteContoursAsStl(stl, contours);
            else
                WriteContoursAsStl(stl, contours, preserveHoles: false, cleanForPrint: true);
        }

        stl.AppendLine("endsolid makernames");

        return stl.ToString();
    }

    private static string GetImportedObjectStlMode(ImportedObject item)
    {
        if (!string.IsNullOrWhiteSpace(item.StlMode))
            return item.StlMode.Trim().ToLowerInvariant();

        if (item.SourceKind.Equals("image-trace", StringComparison.OrdinalIgnoreCase))
            return "line-art";

        return "";
    }

    private static float GetCutY(NameProject project)
    {
        return project.BaseLineY;
    }

    private void WriteLineArtContoursAsStl(StringBuilder stl, IEnumerable<List<PointF>> contourOriginals)
    {
        List<List<PointF>> contours = contourOriginals
            .Select(contour => GeometryUtils.CleanPolygonForStl(contour))
            .Where(contour => contour.Count >= 3 && Math.Abs(GetSignedArea(contour)) > 0.01f)
            .ToList();

        if (contours.Count == 0)
            return;

        foreach (List<List<PointF>> group in GetEvenOddContourGroups(contours))
            WriteTessellatedContours(stl, group, WindingRule.EvenOdd);
    }

    private void WriteCookieCutterContoursAsStl(StringBuilder stl, IEnumerable<List<PointF>> contourOriginals)
    {
        List<List<PointF>> contours = contourOriginals
            .Select(contour => GeometryUtils.CleanPolygonForStl(contour, tolerance: 0.18f, minDistance: 0.12f, maxPoints: 720))
            .Where(contour => contour.Count >= 3 && Math.Abs(GetSignedArea(contour)) > 0.01f)
            .ToList();

        if (contours.Count == 0)
            return;

        float cutterHeight = Math.Max(Thickness * 3.2f, 16.0f);
        float baseHeight = Math.Min(Math.Max(Thickness * 0.35f, 1.4f), cutterHeight * 0.25f);

        foreach (List<List<PointF>> group in GetEvenOddContourGroups(contours))
        {
            WriteTessellatedContours(stl, group, WindingRule.EvenOdd, baseHeight);

            foreach (List<PointF> contour in group)
                WriteStlSideWalls(stl, contour, baseHeight, cutterHeight);
        }
    }

    private void WriteSilhouetteContoursAsStl(StringBuilder stl, IEnumerable<List<PointF>> contourOriginals)
    {
        List<List<PointF>> contours = contourOriginals
            .Select(contour => GeometryUtils.CleanPolygonForStl(contour, tolerance: 0.22f, minDistance: 0.12f, maxPoints: 900))
            .Where(contour => contour.Count >= 3 && Math.Abs(GetSignedArea(contour)) > 0.01f)
            .ToList();

        if (contours.Count == 0)
            return;

        List<List<PointF>> silhouette = BuildFilledSilhouetteContours(contours);

        if (silhouette.Count == 0)
        {
            WriteContoursAsStl(stl, contours, preserveHoles: false, cleanForPrint: true);
            return;
        }

        WriteContoursAsStl(stl, silhouette, preserveHoles: false, cleanForPrint: true);
    }

    private void WriteContoursAsStl(
        StringBuilder stl,
        IEnumerable<List<PointF>> contourOriginals,
        bool preserveHoles = true,
        bool cleanForPrint = false,
        WindingRule windingRule = WindingRule.EvenOdd)
    {
        List<List<PointF>> contours = contourOriginals
            .Select(contour => cleanForPrint
                ? GeometryUtils.CleanPolygonForStl(contour)
                : GeometryUtils.RemoveRepeatedPoints(contour))
            .Where(contour => contour.Count >= 3 && Math.Abs(GetSignedArea(contour)) > 0.01f)
            .ToList();

        if (contours.Count == 0)
            return;

        if (!preserveHoles)
        {
            foreach (List<PointF> contour in GetExteriorContours(contours))
                WriteTessellatedContours(stl, new[] { contour }, windingRule);

            return;
        }

        WriteTessellatedContours(stl, contours, windingRule);
    }

    private static List<List<List<PointF>>> GetEvenOddContourGroups(List<List<PointF>> contours)
    {
        int count = contours.Count;
        float[] areas = contours.Select(contour => Math.Abs(GetSignedArea(contour))).ToArray();
        int[] parents = Enumerable.Repeat(-1, count).ToArray();
        int[] depths = Enumerable.Repeat(-1, count).ToArray();

        for (int i = 0; i < count; i++)
        {
            PointF testPoint = GetPolygonCentroid(contours[i]);
            float bestParentArea = float.MaxValue;

            for (int j = 0; j < count; j++)
            {
                if (i == j || areas[j] <= areas[i] || areas[j] >= bestParentArea)
                    continue;

                if (IsContourInsideLargerContour(contours[i], testPoint, contours[j]))
                {
                    parents[i] = j;
                    bestParentArea = areas[j];
                }
            }
        }

        for (int i = 0; i < count; i++)
            depths[i] = GetContourDepth(i, parents, depths);

        List<List<List<PointF>>> groups = new();

        for (int i = 0; i < count; i++)
        {
            if (depths[i] % 2 != 0)
                continue;

            List<List<PointF>> group = new() { contours[i] };

            for (int j = 0; j < count; j++)
            {
                if (parents[j] == i && depths[j] == depths[i] + 1)
                    group.Add(contours[j]);
            }

            groups.Add(group);
        }

        return groups;
    }

    private static int GetContourDepth(int index, int[] parents, int[] depths)
    {
        if (depths[index] >= 0)
            return depths[index];

        int parent = parents[index];

        if (parent < 0)
        {
            depths[index] = 0;
            return 0;
        }

        depths[index] = GetContourDepth(parent, parents, depths) + 1;
        return depths[index];
    }

    private void WriteTessellatedContours(
        StringBuilder stl,
        IEnumerable<List<PointF>> contours,
        WindingRule windingRule,
        float? heightOverride = null,
        bool includeFront = true,
        bool includeBack = true,
        bool includeSideWalls = true)
    {
        List<List<PointF>> contourList = contours.ToList();

        if (contourList.Count == 0)
            return;

        float height = heightOverride ?? Thickness;
        Tess tess = new();

        try
        {
            foreach (List<PointF> contour in contourList)
            {
                ContourVertex[] vertices = new ContourVertex[contour.Count];

                for (int i = 0; i < contour.Count; i++)
                    vertices[i].Position = new Vec3(contour[i].X, -contour[i].Y, 0);

                tess.AddContour(vertices, ContourOrientation.Original);
            }

            tess.Tessellate(windingRule, ElementType.Polygons, 3);
        }
        catch
        {
            return;
        }

        for (int i = 0; i < tess.ElementCount; i++)
        {
            int i0 = tess.Elements[i * 3];
            int i1 = tess.Elements[i * 3 + 1];
            int i2 = tess.Elements[i * 3 + 2];

            if (i0 < 0 || i1 < 0 || i2 < 0)
                continue;

            Point3D p0Front = ToPoint3D(tess.Vertices[i0].Position, height);
            Point3D p1Front = ToPoint3D(tess.Vertices[i1].Position, height);
            Point3D p2Front = ToPoint3D(tess.Vertices[i2].Position, height);

            Point3D p0Back = ToPoint3D(tess.Vertices[i0].Position, 0);
            Point3D p1Back = ToPoint3D(tess.Vertices[i1].Position, 0);
            Point3D p2Back = ToPoint3D(tess.Vertices[i2].Position, 0);

            if (includeFront)
                WriteStlTriangle(stl, p0Front, p1Front, p2Front);

            if (includeBack)
                WriteStlTriangle(stl, p2Back, p1Back, p0Back);
        }

        if (includeSideWalls)
        {
            foreach (List<PointF> contour in contourList)
                WriteStlSideWalls(stl, contour, height);
        }
    }

    private static List<List<PointF>> BuildFilledSilhouetteContours(List<List<PointF>> contours)
    {
        if (!TryGetContourBounds(contours, out RectangleF bounds))
            return new List<List<PointF>>();

        const int pad = 8;
        const int targetMaxPixels = 720;
        const int maxPixels = 1100;

        float maxDimension = MathF.Max(bounds.Width, bounds.Height);

        if (maxDimension <= 0.001f)
            return new List<List<PointF>>();

        float scale = targetMaxPixels / maxDimension;
        scale = Math.Clamp(scale, 0.35f, 5.0f);

        int width = (int)MathF.Ceiling(bounds.Width * scale) + (pad * 2) + 1;
        int height = (int)MathF.Ceiling(bounds.Height * scale) + (pad * 2) + 1;

        if (width > maxPixels || height > maxPixels)
        {
            float widthScale = (maxPixels - (pad * 2) - 1) / Math.Max(bounds.Width, 1);
            float heightScale = (maxPixels - (pad * 2) - 1) / Math.Max(bounds.Height, 1);
            scale = Math.Max(0.12f, MathF.Min(widthScale, heightScale));
            width = (int)MathF.Ceiling(bounds.Width * scale) + (pad * 2) + 1;
            height = (int)MathF.Ceiling(bounds.Height * scale) + (pad * 2) + 1;
        }

        width = Math.Clamp(width, 16, maxPixels);
        height = Math.Clamp(height, 16, maxPixels);

        byte[] strokeMask = RasterizeContoursToMask(contours, bounds, scale, pad, width, height);

        if (!strokeMask.Any(value => value != 0))
            return new List<List<PointF>>();

        byte[] sealedMask = DilateMask(strokeMask, width, height, 2);
        byte[] outside = FloodOutside(sealedMask, width, height);
        byte[] filled = new byte[sealedMask.Length];

        for (int i = 0; i < filled.Length; i++)
            filled[i] = outside[i] == 0 ? (byte)1 : (byte)0;

        int minComponentPixels = Math.Max(24, (width * height) / 6500);
        filled = RemoveSmallMaskComponents(filled, width, height, minComponentPixels);

        return TraceMaskContours(filled, width, height)
            .Select(contour => PixelContourToWorld(contour, bounds, scale, pad))
            .Select(contour => GeometryUtils.CleanPolygonForStl(contour, tolerance: 0.85f, minDistance: 0.35f, maxPoints: 900))
            .Where(contour => contour.Count >= 3 && Math.Abs(GetSignedArea(contour)) > 2.0f)
            .OrderByDescending(contour => Math.Abs(GetSignedArea(contour)))
            .Take(24)
            .ToList();
    }

    private static bool TryGetContourBounds(List<List<PointF>> contours, out RectangleF bounds)
    {
        float minX = float.MaxValue;
        float minY = float.MaxValue;
        float maxX = float.MinValue;
        float maxY = float.MinValue;

        foreach (List<PointF> contour in contours)
        {
            foreach (PointF point in contour)
            {
                if (!float.IsFinite(point.X) || !float.IsFinite(point.Y))
                    continue;

                minX = MathF.Min(minX, point.X);
                minY = MathF.Min(minY, point.Y);
                maxX = MathF.Max(maxX, point.X);
                maxY = MathF.Max(maxY, point.Y);
            }
        }

        if (minX == float.MaxValue || maxX - minX < 0.001f || maxY - minY < 0.001f)
        {
            bounds = RectangleF.Empty;
            return false;
        }

        bounds = RectangleF.FromLTRB(minX, minY, maxX, maxY);
        return true;
    }

    private static byte[] RasterizeContoursToMask(
        List<List<PointF>> contours,
        RectangleF bounds,
        float scale,
        int pad,
        int width,
        int height)
    {
        using Bitmap bitmap = new(width, height);
        using Graphics graphics = Graphics.FromImage(bitmap);
        using SolidBrush brush = new(Color.Black);

        graphics.Clear(Color.White);
        graphics.SmoothingMode = SmoothingMode.None;
        graphics.PixelOffsetMode = PixelOffsetMode.Half;

        foreach (List<PointF> contour in contours)
        {
            PointF[] points = contour
                .Select(point => new PointF(
                    ((point.X - bounds.Left) * scale) + pad,
                    ((point.Y - bounds.Top) * scale) + pad))
                .ToArray();

            if (points.Length >= 3)
                graphics.FillPolygon(brush, points, FillMode.Winding);
        }

        byte[] mask = new byte[width * height];

        for (int y = 0; y < height; y++)
        {
            for (int x = 0; x < width; x++)
            {
                Color pixel = bitmap.GetPixel(x, y);

                if (pixel.R < 250 || pixel.G < 250 || pixel.B < 250)
                    mask[(y * width) + x] = 1;
            }
        }

        return mask;
    }

    private static byte[] DilateMask(byte[] mask, int width, int height, int radius)
    {
        if (radius <= 0)
            return mask;

        byte[] result = new byte[mask.Length];

        for (int y = 0; y < height; y++)
        {
            for (int x = 0; x < width; x++)
            {
                if (mask[(y * width) + x] == 0)
                    continue;

                for (int dy = -radius; dy <= radius; dy++)
                {
                    int ny = y + dy;

                    if (ny < 0 || ny >= height)
                        continue;

                    for (int dx = -radius; dx <= radius; dx++)
                    {
                        int nx = x + dx;

                        if (nx >= 0 && nx < width)
                            result[(ny * width) + nx] = 1;
                    }
                }
            }
        }

        return result;
    }

    private static byte[] FloodOutside(byte[] blocked, int width, int height)
    {
        byte[] outside = new byte[blocked.Length];
        int[] queue = new int[blocked.Length];
        int head = 0;
        int tail = 0;

        void Enqueue(int x, int y)
        {
            if (x < 0 || x >= width || y < 0 || y >= height)
                return;

            int index = (y * width) + x;

            if (blocked[index] != 0 || outside[index] != 0)
                return;

            outside[index] = 1;
            queue[tail++] = index;
        }

        for (int x = 0; x < width; x++)
        {
            Enqueue(x, 0);
            Enqueue(x, height - 1);
        }

        for (int y = 1; y < height - 1; y++)
        {
            Enqueue(0, y);
            Enqueue(width - 1, y);
        }

        while (head < tail)
        {
            int index = queue[head++];
            int x = index % width;
            int y = index / width;

            Enqueue(x + 1, y);
            Enqueue(x - 1, y);
            Enqueue(x, y + 1);
            Enqueue(x, y - 1);
        }

        return outside;
    }

    private static byte[] RemoveSmallMaskComponents(byte[] mask, int width, int height, int minPixels)
    {
        byte[] result = new byte[mask.Length];
        byte[] visited = new byte[mask.Length];
        int[] queue = new int[mask.Length];

        for (int y = 0; y < height; y++)
        {
            for (int x = 0; x < width; x++)
            {
                int start = (y * width) + x;

                if (mask[start] == 0 || visited[start] != 0)
                    continue;

                int head = 0;
                int tail = 0;
                visited[start] = 1;
                queue[tail++] = start;

                while (head < tail)
                {
                    int index = queue[head++];
                    int px = index % width;
                    int py = index / width;

                    TryAddMaskNeighbor(px + 1, py);
                    TryAddMaskNeighbor(px - 1, py);
                    TryAddMaskNeighbor(px, py + 1);
                    TryAddMaskNeighbor(px, py - 1);
                }

                if (tail >= minPixels)
                {
                    for (int i = 0; i < tail; i++)
                        result[queue[i]] = 1;
                }

                void TryAddMaskNeighbor(int nx, int ny)
                {
                    if (nx < 0 || nx >= width || ny < 0 || ny >= height)
                        return;

                    int neighbor = (ny * width) + nx;

                    if (mask[neighbor] == 0 || visited[neighbor] != 0)
                        return;

                    visited[neighbor] = 1;
                    queue[tail++] = neighbor;
                }
            }
        }

        return result;
    }

    private static List<List<PointF>> TraceMaskContours(byte[] mask, int width, int height)
    {
        int pointsPerRow = width + 1;
        HashSet<(int From, int To)> unusedEdges = new();
        Dictionary<int, List<int>> nextByStart = new();

        void AddEdge(int x1, int y1, int x2, int y2)
        {
            int from = GetMaskPointKey(x1, y1, pointsPerRow);
            int to = GetMaskPointKey(x2, y2, pointsPerRow);

            if (!unusedEdges.Add((from, to)))
                return;

            if (!nextByStart.TryGetValue(from, out List<int>? nextPoints))
            {
                nextPoints = new List<int>();
                nextByStart[from] = nextPoints;
            }

            nextPoints.Add(to);
        }

        for (int y = 0; y < height; y++)
        {
            for (int x = 0; x < width; x++)
            {
                if (!IsMaskOn(mask, width, height, x, y))
                    continue;

                if (!IsMaskOn(mask, width, height, x, y - 1))
                    AddEdge(x, y, x + 1, y);

                if (!IsMaskOn(mask, width, height, x + 1, y))
                    AddEdge(x + 1, y, x + 1, y + 1);

                if (!IsMaskOn(mask, width, height, x, y + 1))
                    AddEdge(x + 1, y + 1, x, y + 1);

                if (!IsMaskOn(mask, width, height, x - 1, y))
                    AddEdge(x, y + 1, x, y);
            }
        }

        List<List<PointF>> contours = new();
        int maxSteps = Math.Max(256, unusedEdges.Count + 4);

        while (unusedEdges.Count > 0)
        {
            (int From, int To) startEdge = unusedEdges.First();
            int start = startEdge.From;
            int previous = startEdge.From;
            int current = startEdge.To;
            List<PointF> contour = new();
            int guard = 0;

            while (guard++ < maxSteps)
            {
                unusedEdges.Remove((previous, current));
                contour.Add(DecodeMaskPoint(previous, pointsPerRow));

                if (current == start)
                {
                    contour.Add(DecodeMaskPoint(current, pointsPerRow));
                    break;
                }

                if (!TryGetNextMaskTracePoint(nextByStart, unusedEdges, previous, current, pointsPerRow, out int next))
                    break;

                previous = current;
                current = next;
            }

            contour = GeometryUtils.RemoveRepeatedPoints(contour);

            if (contour.Count >= 3)
                contours.Add(contour);
        }

        return contours;
    }

    private static bool TryGetNextMaskTracePoint(
        Dictionary<int, List<int>> nextByStart,
        HashSet<(int From, int To)> unusedEdges,
        int previous,
        int current,
        int pointsPerRow,
        out int next)
    {
        next = 0;

        if (!nextByStart.TryGetValue(current, out List<int>? candidates))
            return false;

        List<int> active = candidates
            .Where(candidate => unusedEdges.Contains((current, candidate)))
            .ToList();

        if (active.Count == 0)
            return false;

        next = active.Count == 1
            ? active[0]
            : active.OrderBy(candidate => GetMaskTraceTurnScore(previous, current, candidate, pointsPerRow)).First();

        return true;
    }

    private static int GetMaskTraceTurnScore(int previous, int current, int candidate, int pointsPerRow)
    {
        int previousDirection = GetMaskDirection(previous, current, pointsPerRow);
        int candidateDirection = GetMaskDirection(current, candidate, pointsPerRow);
        int turn = (candidateDirection - previousDirection + 4) % 4;

        return turn switch
        {
            0 => 0,
            1 => 1,
            3 => 2,
            _ => 3
        };
    }

    private static int GetMaskDirection(int from, int to, int pointsPerRow)
    {
        int fx = from % pointsPerRow;
        int fy = from / pointsPerRow;
        int tx = to % pointsPerRow;
        int ty = to / pointsPerRow;

        if (tx > fx)
            return 0;

        if (ty > fy)
            return 1;

        if (tx < fx)
            return 2;

        return 3;
    }

    private static List<PointF> PixelContourToWorld(List<PointF> contour, RectangleF bounds, float scale, int pad)
    {
        return contour
            .Select(point => new PointF(
                ((point.X - pad) / scale) + bounds.Left,
                ((point.Y - pad) / scale) + bounds.Top))
            .ToList();
    }

    private static bool IsMaskOn(byte[] mask, int width, int height, int x, int y)
    {
        return x >= 0 && x < width && y >= 0 && y < height && mask[(y * width) + x] != 0;
    }

    private static int GetMaskPointKey(int x, int y, int pointsPerRow)
    {
        return (y * pointsPerRow) + x;
    }

    private static PointF DecodeMaskPoint(int key, int pointsPerRow)
    {
        return new PointF(key % pointsPerRow, key / pointsPerRow);
    }

    private static List<List<PointF>> GetExteriorContours(List<List<PointF>> contours)
    {
        List<List<PointF>> exteriors = new();

        for (int i = 0; i < contours.Count; i++)
        {
            List<PointF> candidate = contours[i];
            PointF testPoint = GetPolygonCentroid(candidate);
            bool insideLargerContour = false;
            float candidateArea = Math.Abs(GetSignedArea(candidate));

            for (int j = 0; j < contours.Count; j++)
            {
                if (i == j)
                    continue;

                List<PointF> other = contours[j];
                float otherArea = Math.Abs(GetSignedArea(other));

                if (otherArea <= candidateArea)
                    continue;

                if (IsContourInsideLargerContour(candidate, testPoint, other))
                {
                    insideLargerContour = true;
                    break;
                }
            }

            if (!insideLargerContour)
                exteriors.Add(candidate);
        }

        return exteriors;
    }

    private static bool IsContourInsideLargerContour(List<PointF> contour, PointF centroid, List<PointF> largerContour)
    {
        if (PointInPolygon(centroid, largerContour))
            return true;

        int step = Math.Max(1, contour.Count / 12);

        for (int i = 0; i < contour.Count; i += step)
        {
            if (PointInPolygon(contour[i], largerContour))
                return true;
        }

        return false;
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

    private static void WriteStlSideWalls(StringBuilder stl, List<PointF> contour, float height)
    {
        WriteStlSideWalls(stl, contour, 0, height);
    }

    private static void WriteStlSideWalls(StringBuilder stl, List<PointF> contour, float bottom, float top)
    {
        for (int i = 0; i < contour.Count; i++)
        {
            PointF a = contour[i];
            PointF b = contour[(i + 1) % contour.Count];

            Point3D a0 = new(a.X, -a.Y, bottom);
            Point3D b0 = new(b.X, -b.Y, bottom);
            Point3D a1 = new(a.X, -a.Y, top);
            Point3D b1 = new(b.X, -b.Y, top);

            WriteStlTriangle(stl, a0, b0, b1);
            WriteStlTriangle(stl, a0, b1, a1);
        }
    }

    private static Point3D ToPoint3D(Vec3 vec, float z)
    {
        return new Point3D(vec.X, vec.Y, z);
    }

    private static void WriteStlTriangle(StringBuilder stl, Point3D p1, Point3D p2, Point3D p3)
    {
        Point3D normal = CalculateNormal(p1, p2, p3);

        stl.AppendFormat(
            CultureInfo.InvariantCulture,
            "  facet normal {0:0.######} {1:0.######} {2:0.######}\n",
            normal.X,
            normal.Y,
            normal.Z
        );

        stl.AppendLine("    outer loop");
        WriteVertex(stl, p1);
        WriteVertex(stl, p2);
        WriteVertex(stl, p3);
        stl.AppendLine("    endloop");
        stl.AppendLine("  endfacet");
    }

    private static void WriteVertex(StringBuilder stl, Point3D point)
    {
        stl.AppendFormat(
            CultureInfo.InvariantCulture,
            "      vertex {0:0.######} {1:0.######} {2:0.######}\n",
            point.X,
            point.Y,
            point.Z
        );
    }

    private static Point3D CalculateNormal(Point3D p1, Point3D p2, Point3D p3)
    {
        float ux = p2.X - p1.X;
        float uy = p2.Y - p1.Y;
        float uz = p2.Z - p1.Z;

        float vx = p3.X - p1.X;
        float vy = p3.Y - p1.Y;
        float vz = p3.Z - p1.Z;

        float nx = uy * vz - uz * vy;
        float ny = uz * vx - ux * vz;
        float nz = ux * vy - uy * vx;

        float length = MathF.Sqrt(nx * nx + ny * ny + nz * nz);

        if (length < 0.0001f)
            return new Point3D(0, 0, 0);

        return new Point3D(nx / length, ny / length, nz / length);
    }

    private readonly struct Point3D
    {
        public Point3D(float x, float y, float z)
        {
            X = x;
            Y = y;
            Z = z;
        }

        public float X { get; }
        public float Y { get; }
        public float Z { get; }
    }
}
