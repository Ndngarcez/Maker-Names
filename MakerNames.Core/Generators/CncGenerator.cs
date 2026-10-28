using System.Drawing;
using System.Globalization;
using System.Text;
using Clipper2Lib;
using MakerNames.Core.Geometry;
using MakerNames.Core.Models;

namespace MakerNames.Core.Generators;

public class CncSettings
{
    public double WorkWidth { get; set; }
    public double WorkHeight { get; set; }
    public double DesignX { get; set; } = 10;
    public double DesignY { get; set; } = 10;
    public double Width { get; set; } = 200;
    public double Depth { get; set; } = 3;
    public int Passes { get; set; } = 3;
    public double Diameter { get; set; } = 3;
    public int Tool { get; set; } = 1;
    public double Feed { get; set; } = 600;
    public double Plunge { get; set; } = 150;
    public int Rpm { get; set; } = 12000;
    public double SafeZ { get; set; } = 5;
    public bool Clockwise { get; set; } = true;
    public string Start { get; set; } = "left";
    public string Origin { get; set; } = "corner";
    public string Controller { get; set; } = "grbl";
}
public record CncPoint(double X, double Y);
public record CncResult(List<List<CncPoint>> Paths, List<List<CncPoint>> Outline, double[] Depths, string Gcode, double Width, double Height, double Diameter, bool CanExport, string? Warning, string SimulationGcode, double WorkWidth, double WorkHeight, double WorkX, double WorkY);

public class CncGenerator
{
    private static void Validate(CncSettings s)
    {
        if (s.WorkWidth != 0 || s.WorkHeight != 0) {
            Check(s.WorkWidth, 1, 3000, "Área: largura"); Check(s.WorkHeight, 1, 3000, "Área: altura");
            Check(s.DesignX, 0, 3000, "Posição X"); Check(s.DesignY, 0, 3000, "Posição Y");
        }
        Check(s.Width, 1, 3000, "Largura"); Check(s.Depth, .01, 100, "Profundidade");
        Check(s.Diameter, .1, 100, "Diâmetro"); Check(s.Feed, 1, 30000, "Avanço");
        Check(s.Plunge, 1, 10000, "Descida"); Check(s.SafeZ, .1, 100, "Z seguro");
        Check(s.Passes, 1, 100, "Passagens"); Check(s.Tool, 1, 255, "Ferramenta"); Check(s.Rpm, 1, 60000, "RPM");
        if (s.Depth / s.Passes < .001) throw new ArgumentException("Cada passagem deve ter pelo menos 0,001 mm.");
        if (!new[] { "grbl", "mach3" }.Contains(s.Controller) || !new[] { "left", "right", "top", "bottom" }.Contains(s.Start) || !new[] { "corner", "center" }.Contains(s.Origin))
            throw new ArgumentException("Configuração CNC inválida.");
    }

    public CncResult Generate(NameProject project, CncSettings s, List<List<CncPoint>>? shapes = null, bool includeName = true)
    {
        Validate(s);
        var extra = new PathsD();
        if (shapes != null) {
            if (shapes.Count > 100 || shapes.Sum(p => p?.Count ?? 0) > 10000) throw new ArgumentException("Demasiadas figuras.");
            foreach (var polygon in shapes) {
                if (polygon == null || polygon.Count < 3 || polygon.Any(p => p == null || !double.IsFinite(p.X) || !double.IsFinite(p.Y) || Math.Abs(p.X)>3000 || Math.Abs(p.Y)>3000)) throw new ArgumentException("Figura inválida.");
                var path = new PathD(polygon.Select(p => new PointD(p.X,p.Y)));
                if (Clipper.Area(path) < 0) path.Reverse();
                extra.Add(path);
            }
        }
        if (!includeName) return Plan(extra, s, true);
        if (project.Text is null || project.Text.Length > 200 || project.Letters is null || project.PlacedNames is null || project.ImportedObjects is null)
            throw new ArgumentException("Projeto CNC inválido ou demasiado extenso.");
        if (project.Letters.Count > 200 || project.PlacedNames.Count > 100 || project.ImportedObjects.Count > 100)
            throw new ArgumentException("Composição demasiado complexa para CNC.");
        var engine = new NameEngine();
        if (project.Letters.Count == 0) project.Letters = engine.GenerateLetters(project);
        var contours = new PathsD();
        void Add(IEnumerable<List<PointF>> polygons)
        {
            var group = new PathsD(polygons.Where(p => p.Count >= 3).Select(p => new PathD(p.Select(v => new PointD(v.X, -v.Y)))));
            // Normalize each object's holes before unioning overlapping letters/objects.
            contours.AddRange(Clipper.Union(group, FillRule.EvenOdd));
        }
        using var font = engine.CreateFont(project.FontName, project.FontSize);
        foreach (var letter in project.Letters)
        {
            using var path = engine.CreateLetterPath(project, font, letter);
            path.Flatten(null, .1f);
            Add(GeometryUtils.GetPolygonsFromPath(path).Select(p => project.UseBaseLine ? GeometryUtils.ClipPolygonAboveLine(p, project.BaseLineY) : p));
        }
        foreach (var group in PlacedNameRenderer.GetTransformedContoursByName(project)) Add(group);
        foreach (var (_, group) in ImportedObjectRenderer.GetTransformedObjectContours(project)) Add(group);
        if (s.WorkWidth > 0 || extra.Count > 0) {
            var points = contours.SelectMany(p => p).ToList();
            if (points.Count == 0) throw new ArgumentException("Nome sem contornos.");
            var left = points.Min(p => p.x); var bottom = points.Min(p => p.y);
            var span = points.Max(p => p.x)-left;
            if (span <= .001) throw new ArgumentException("Nome sem largura.");
            var scale = s.Width/span;
            extra.AddRange(new PathsD(contours.Select(p => new PathD(p.Select(v => new PointD((v.x-left)*scale+s.DesignX,(v.y-bottom)*scale+s.DesignY))))));
            return Plan(extra,s,true);
        }
        return Plan(contours, s);
    }

    public CncResult Plan(PathsD contours, CncSettings s, bool actualSize = false)
    {
        Validate(s);
        if (contours.Sum(p => p.Count) > 100000 || contours.SelectMany(p => p).Any(p => !double.IsFinite(p.x) || !double.IsFinite(p.y) || Math.Abs(p.x) > 1000000 || Math.Abs(p.y) > 1000000))
            throw new ArgumentException("Geometria inválida ou demasiado complexa.");
        var merged = Clipper.Union(contours, FillRule.NonZero);
        if (merged.Count == 0) throw new ArgumentException("Não existem contornos fechados para cortar.");
        var pts = merged.SelectMany(p => p).ToList();
        var minX = pts.Min(p => p.x); var minY = pts.Min(p => p.y);
        var span = pts.Max(p => p.x) - minX;
        if (span <= .001) throw new ArgumentException("Desenho sem largura.");
        var scale = actualSize ? 1 : s.Width / span;
        var width = span * scale;
        var height = (pts.Max(p => p.y) - minY) * scale;
        Check(height, .01, 3000, "Altura final");
        var ox = s.Origin == "center" ? (s.WorkWidth > 0 ? s.WorkWidth : width) / 2 : 0;
        var oy = s.Origin == "center" ? (s.WorkHeight > 0 ? s.WorkHeight : height) / 2 : 0;
        if (actualSize) { minX=0; minY=0; }
        merged = new PathsD(merged.Select(p => new PathD(p.Select(v => new PointD((v.x-minX)*scale-ox, (v.y-minY)*scale-oy)))));
        var offset = Clipper.InflatePaths(merged, s.Diameter/2, JoinType.Round, EndType.Polygon, precision: 3, arcTolerance: .03);
        if (offset.Count == 0) throw new ArgumentException("Não foi possível calcular um percurso para esta ferramenta.");
        if (s.WorkWidth > 0 && offset.SelectMany(p => p).Any(p => p.x-s.Diameter/2 < -ox-.001 || p.y-s.Diameter/2 < -oy-.001 || p.x+s.Diameter/2 > s.WorkWidth-ox+.001 || p.y+s.Diameter/2 > s.WorkHeight-oy+.001))
            throw new ArgumentException("O corte ultrapassa a área de trabalho, incluindo a largura da fresa. Move ou reduz as figuras, ou aumenta a área.");
        var canExport = offset.Count == merged.Count && offset.Count(p => Clipper.Area(p) < 0) == merged.Count(p => Clipper.Area(p) < 0);
        string? warning = canExport ? null : "Simulação de diagnóstico: a fresa elimina detalhes ou une contornos. O resultado difere do desenho. Para preservar o desenho, reduz o diâmetro ou aumenta a largura. Para exportar este resultado, confirma que aceitas as alterações.";
        var ordered = offset.OrderBy(p => Math.Abs(Clipper.Area(p))).ToList();
        var paths = new List<List<CncPoint>>();
        foreach (var path in ordered)
        {
            if ((Clipper.Area(path) < 0) != s.Clockwise) path.Reverse();
            double Key(PointD p) => s.Start switch { "right" => -p.x, "top" => -p.y, "bottom" => p.y, _ => p.x };
            var start = Enumerable.Range(0, path.Count).MinBy(i => Key(path[i]));
            var loop = Enumerable.Range(0, path.Count).Select(i => path[(start+i)%path.Count]).Select(p => new CncPoint(p.x,p.y)).ToList();
            loop.Add(loop[0]); paths.Add(loop);
        }
        if (paths.Sum(p => p.Count) * (long)s.Passes > 250000) throw new ArgumentException("Percurso demasiado complexo; reduz as passagens ou simplifica o desenho.");
        var depths = Enumerable.Range(1,s.Passes).Select(i => -s.Depth*i/s.Passes).ToArray();
        var code = new StringBuilder();
        string F(double n) => n.ToString("0.###", CultureInfo.InvariantCulture);
        void Line(string line) => code.AppendLine(line);
        Line("(MakerNames CNC - mm - Z0 stock top - G54)");
        Line($"(Tool {s.Tool}, diameter {F(s.Diameter)} mm - fit and zero before running)");
        foreach (var command in new[] { "G21", "G17", "G90", "G94", "G40", "G49", "G80", "G54", "M5", $"G0 Z{F(s.SafeZ)}" }) Line(command);
        if (s.Controller == "mach3") Line($"T{s.Tool} M6");
        Line($"M3 S{s.Rpm}"); Line("G4 P2");
        foreach (var path in paths)
            foreach (var z in depths)
            {
                Line($"G0 Z{F(s.SafeZ)}");
                Line($"G0 X{F(path[0].X)} Y{F(path[0].Y)}");
                Line($"G1 Z{F(z)} F{F(s.Plunge)}");
                foreach (var p in path.Skip(1)) Line($"G1 X{F(p.X)} Y{F(p.Y)} F{F(s.Feed)}");
                Line($"G0 Z{F(s.SafeZ)}");
            }
        Line("M5"); Line("M2");
        return new(paths, merged.Select(p => p.Select(v => new CncPoint(v.x,v.y)).ToList()).ToList(), depths, canExport ? code.ToString() : "", width, height, s.Diameter, canExport, warning, code.ToString(), s.WorkWidth, s.WorkHeight, -ox, -oy);
    }
    private static void Check(double n, double min, double max, string name)
    {
        if (!double.IsFinite(n) || n < min || n > max) throw new ArgumentException($"{name}: usa um valor entre {min} e {max}.");
    }
}

