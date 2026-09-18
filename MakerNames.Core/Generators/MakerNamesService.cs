using MakerNames.Core.Models;

namespace MakerNames.Core.Generators;

public class MakerNamesService
{
    private readonly NameEngine _engine = new();
    private readonly SvgGenerator _svg = new();
    private readonly DxfGenerator _dxf = new();
    private readonly StlGenerator _stl = new();

    public GenerateResult Generate(NameProject project)
    {
        if (project.Letters == null || project.Letters.Count == 0)
        {
            project.Letters = _engine.GenerateLetters(project);
        }

        return new GenerateResult
        {
            Svg = _svg.Generate(project),
            Dxf = _dxf.Generate(project),
            Stl = _stl.Generate(project)
        };
    }
}
