using MakerNames.Core.Generators;
using MakerNames.Core.Models;
using Microsoft.AspNetCore.Mvc;
namespace MakerNames.Api.Controllers;

[ApiController]
[Route("api/cnc")]
public class CncController : ControllerBase
{
    public record PlanRequest(NameProject Project, CncSettings Settings, List<List<CncPoint>>? Shapes = null, bool IncludeName = true);
    [HttpPost("plan")]
    [RequestSizeLimit(2_000_000)]
    public IActionResult Plan([FromBody] PlanRequest request)
    {
        if (request.Project is null || request.Settings is null) return BadRequest(new { message = "Projeto e parâmetros obrigatórios." });
        try { return Ok(new CncGenerator().Generate(request.Project, request.Settings, request.Shapes, request.IncludeName)); }
        catch (ArgumentException e) { return BadRequest(new { message = e.Message }); }
    }
}

