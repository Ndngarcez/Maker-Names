using Microsoft.AspNetCore.Mvc;

namespace MakerNames.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class AdsController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public AdsController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet("rewarded-config")]
    public ActionResult<RewardedAdsConfigResponse> RewardedConfig()
    {
        var adUnitPath = _configuration["RewardedAds:AdUnitPath"]?.Trim() ?? "";
        var provider = _configuration["RewardedAds:Provider"]?.Trim() ?? "google-ad-manager";
        var fallbackEnabled = !bool.TryParse(_configuration["RewardedAds:FallbackEnabled"], out var fallback) || fallback;

        return Ok(new RewardedAdsConfigResponse(
            provider,
            !string.IsNullOrWhiteSpace(adUnitPath),
            adUnitPath,
            fallbackEnabled
        ));
    }
}

public sealed record RewardedAdsConfigResponse(
    string Provider,
    bool Enabled,
    string AdUnitPath,
    bool FallbackEnabled
);
