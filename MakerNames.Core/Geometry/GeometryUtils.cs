using System.Drawing;
using System.Drawing.Drawing2D;

namespace MakerNames.Core.Geometry;

public static class GeometryUtils
{
    public static List<List<PointF>> GetPolygonsFromPath(GraphicsPath path)
    {
        List<List<PointF>> polygons = new();

        if (path == null || path.PointCount == 0)
            return polygons;

        PointF[] points = path.PathPoints;
        byte[] types = path.PathTypes;
        List<PointF> current = new();

        for (int i = 0; i < points.Length; i++)
        {
            byte type = (byte)(types[i] & 0x07);
            bool close = (types[i] & 0x80) != 0;

            if (type == 0)
            {
                if (current.Count > 2)
                    polygons.Add(new List<PointF>(current));

                current.Clear();
            }

            current.Add(points[i]);

            if (close)
            {
                if (current.Count > 2)
                    polygons.Add(new List<PointF>(current));

                current.Clear();
            }
        }

        if (current.Count > 2)
            polygons.Add(current);

        return polygons;
    }

    public static List<PointF> ClipPolygonAboveLine(List<PointF> polygon, float cutY)
    {
        List<PointF> result = new();

        if (polygon == null || polygon.Count == 0)
            return result;

        for (int i = 0; i < polygon.Count; i++)
        {
            PointF current = polygon[i];
            PointF previous = polygon[(i + polygon.Count - 1) % polygon.Count];

            bool currentInside = current.Y <= cutY;
            bool previousInside = previous.Y <= cutY;

            if (currentInside)
            {
                if (!previousInside)
                    result.Add(HorizontalIntersection(previous, current, cutY));

                result.Add(current);
            }
            else if (previousInside)
            {
                result.Add(HorizontalIntersection(previous, current, cutY));
            }
        }

        return result;
    }

    public static PointF HorizontalIntersection(PointF p1, PointF p2, float y)
    {
        if (Math.Abs(p2.Y - p1.Y) < 0.001f)
            return new PointF(p1.X, y);

        float t = (y - p1.Y) / (p2.Y - p1.Y);
        float x = p1.X + t * (p2.X - p1.X);

        return new PointF(x, y);
    }

    public static List<PointF> RemoveRepeatedPoints(List<PointF> points)
    {
        List<PointF> result = new();

        if (points == null)
            return result;

        foreach (PointF point in points)
        {
            if (result.Count == 0 || Distance(result[^1], point) > 0.01f)
                result.Add(point);
        }

        if (result.Count > 1 && Distance(result[0], result[^1]) < 0.01f)
            result.RemoveAt(result.Count - 1);

        return result;
    }

    public static List<PointF> CleanPolygonForStl(List<PointF> points, float tolerance = 0.35f, float minDistance = 0.18f, int maxPoints = 480)
    {
        if (points == null || points.Count < 3)
            return new List<PointF>();

        List<PointF> cleaned = points
            .Where(point => float.IsFinite(point.X) && float.IsFinite(point.Y))
            .ToList();

        cleaned = RemoveRepeatedPoints(cleaned);
        cleaned = RemoveShortSegments(cleaned, minDistance);
        cleaned = RemoveCollinearPoints(cleaned, 0.02f);

        if (cleaned.Count < 3 || Math.Abs(GetSignedArea(cleaned)) < 2.0f)
            return new List<PointF>();

        float activeTolerance = tolerance;
        cleaned = SimplifyClosedPolygon(cleaned, activeTolerance);

        while (cleaned.Count > maxPoints && activeTolerance < 6.0f)
        {
            activeTolerance *= 1.45f;
            cleaned = SimplifyClosedPolygon(cleaned, activeTolerance);
        }

        cleaned = RemoveRepeatedPoints(cleaned);
        cleaned = RemoveShortSegments(cleaned, minDistance);
        cleaned = RemoveCollinearPoints(cleaned, 0.02f);

        if (cleaned.Count < 3 || Math.Abs(GetSignedArea(cleaned)) < 2.0f)
            return new List<PointF>();

        if (HasSelfIntersections(cleaned))
        {
            cleaned = SimplifyClosedPolygon(cleaned, Math.Max(activeTolerance * 1.8f, 1.0f));
            cleaned = RemoveRepeatedPoints(cleaned);
            cleaned = RemoveShortSegments(cleaned, minDistance * 1.6f);
            cleaned = RemoveCollinearPoints(cleaned, 0.04f);

            if (cleaned.Count < 3 || HasSelfIntersections(cleaned))
                return new List<PointF>();
        }

        return cleaned;
    }

    public static bool HasSelfIntersections(List<PointF> polygon)
    {
        if (polygon == null || polygon.Count < 4)
            return false;

        for (int i = 0; i < polygon.Count; i++)
        {
            PointF a1 = polygon[i];
            PointF a2 = polygon[(i + 1) % polygon.Count];

            for (int j = i + 1; j < polygon.Count; j++)
            {
                if (Math.Abs(i - j) <= 1)
                    continue;

                if (i == 0 && j == polygon.Count - 1)
                    continue;

                PointF b1 = polygon[j];
                PointF b2 = polygon[(j + 1) % polygon.Count];

                if (SegmentsIntersect(a1, a2, b1, b2))
                    return true;
            }
        }

        return false;
    }

    private static List<PointF> RemoveShortSegments(List<PointF> points, float minDistance)
    {
        List<PointF> result = new();

        foreach (PointF point in points)
        {
            if (result.Count == 0 || Distance(result[^1], point) >= minDistance)
                result.Add(point);
        }

        if (result.Count > 2 && Distance(result[0], result[^1]) < minDistance)
            result.RemoveAt(result.Count - 1);

        return result;
    }

    private static List<PointF> RemoveCollinearPoints(List<PointF> points, float tolerance)
    {
        if (points.Count < 4)
            return points;

        List<PointF> result = new();

        for (int i = 0; i < points.Count; i++)
        {
            PointF previous = points[(i + points.Count - 1) % points.Count];
            PointF current = points[i];
            PointF next = points[(i + 1) % points.Count];
            float area = Math.Abs(((current.X - previous.X) * (next.Y - previous.Y)) - ((current.Y - previous.Y) * (next.X - previous.X)));

            if (area > tolerance)
                result.Add(current);
        }

        return result.Count >= 3 ? result : points;
    }

    private static List<PointF> SimplifyClosedPolygon(List<PointF> points, float tolerance)
    {
        if (points.Count <= 12 || tolerance <= 0)
            return points;

        List<PointF> open = new(points) { points[0] };
        List<PointF> simplified = SimplifyOpenPolyline(open, tolerance);

        if (simplified.Count > 1 && Distance(simplified[0], simplified[^1]) < 0.01f)
            simplified.RemoveAt(simplified.Count - 1);

        return simplified.Count >= 3 ? simplified : points;
    }

    private static List<PointF> SimplifyOpenPolyline(List<PointF> points, float tolerance)
    {
        if (points.Count < 3)
            return new List<PointF>(points);

        int index = -1;
        float maxDistance = 0;

        for (int i = 1; i < points.Count - 1; i++)
        {
            float distance = PerpendicularDistance(points[i], points[0], points[^1]);

            if (distance > maxDistance)
            {
                index = i;
                maxDistance = distance;
            }
        }

        if (maxDistance <= tolerance || index < 0)
            return new List<PointF> { points[0], points[^1] };

        List<PointF> left = SimplifyOpenPolyline(points.GetRange(0, index + 1), tolerance);
        List<PointF> right = SimplifyOpenPolyline(points.GetRange(index, points.Count - index), tolerance);
        left.RemoveAt(left.Count - 1);
        left.AddRange(right);

        return left;
    }

    private static float PerpendicularDistance(PointF point, PointF lineStart, PointF lineEnd)
    {
        float dx = lineEnd.X - lineStart.X;
        float dy = lineEnd.Y - lineStart.Y;
        float length = MathF.Sqrt((dx * dx) + (dy * dy));

        if (length < 0.0001f)
            return Distance(point, lineStart);

        return Math.Abs((dy * point.X) - (dx * point.Y) + (lineEnd.X * lineStart.Y) - (lineEnd.Y * lineStart.X)) / length;
    }

    private static float GetSignedArea(List<PointF> polygon)
    {
        double area = 0;

        for (int i = 0; i < polygon.Count; i++)
        {
            PointF a = polygon[i];
            PointF b = polygon[(i + 1) % polygon.Count];
            area += (a.X * b.Y) - (b.X * a.Y);
        }

        return (float)(area / 2.0);
    }

    private static bool SegmentsIntersect(PointF a, PointF b, PointF c, PointF d)
    {
        float o1 = Orientation(a, b, c);
        float o2 = Orientation(a, b, d);
        float o3 = Orientation(c, d, a);
        float o4 = Orientation(c, d, b);

        if (o1 * o2 < 0 && o3 * o4 < 0)
            return true;

        const float epsilon = 0.001f;

        return Math.Abs(o1) < epsilon && IsOnSegment(a, c, b) ||
            Math.Abs(o2) < epsilon && IsOnSegment(a, d, b) ||
            Math.Abs(o3) < epsilon && IsOnSegment(c, a, d) ||
            Math.Abs(o4) < epsilon && IsOnSegment(c, b, d);
    }

    private static float Orientation(PointF a, PointF b, PointF c)
    {
        return ((b.X - a.X) * (c.Y - a.Y)) - ((b.Y - a.Y) * (c.X - a.X));
    }

    private static bool IsOnSegment(PointF a, PointF b, PointF c)
    {
        return b.X <= Math.Max(a.X, c.X) + 0.001f &&
            b.X >= Math.Min(a.X, c.X) - 0.001f &&
            b.Y <= Math.Max(a.Y, c.Y) + 0.001f &&
            b.Y >= Math.Min(a.Y, c.Y) - 0.001f;
    }

    public static float Distance(PointF a, PointF b)
    {
        float dx = a.X - b.X;
        float dy = a.Y - b.Y;

        return MathF.Sqrt(dx * dx + dy * dy);
    }
}
