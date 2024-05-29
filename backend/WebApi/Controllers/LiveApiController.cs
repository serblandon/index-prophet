using Microsoft.AspNetCore.Mvc;
using WebApi.Logic.LiveApi;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LiveApiController : ControllerBase
    {
        private readonly LiveApiService _liveApiService;

        public LiveApiController(LiveApiService liveApiService)
        {
            _liveApiService = liveApiService;
        }

        [HttpGet("topGainersAndLosers")]
        public async Task<IActionResult> GetTopGainersAndLosers()
        {
            var (topGainers, topLosers) = await _liveApiService.GetTopGainersAndLosers();
            var result = new
            {
                topGainers,
                topLosers
            };

            if (!result.topGainers.Any() && !result.topLosers.Any())
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpGet("overview/{symbol}")]
        public async Task<IActionResult> GetCompanyOverview(string symbol)
        {
            var result = await _liveApiService.GetCompanyOverview(symbol);
            return Ok(result);
        }
    }
}
