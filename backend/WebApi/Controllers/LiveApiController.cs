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

        [HttpGet("{symbol}/balanceSheet")]
        public async Task<IActionResult> GetBalanceSheet(string symbol)
        {
            var data = await _liveApiService.GetFinancialStatement(symbol, "BALANCE_SHEET");
            return Ok(data);
        }

        [HttpGet("{symbol}/incomeStatement")]
        public async Task<IActionResult> GetIncomeStatement(string symbol)
        {
            var data = await _liveApiService.GetFinancialStatement(symbol, "INCOME_STATEMENT");
            return Ok(data);
        }

        [HttpGet("{symbol}/cashFlow")]
        public async Task<IActionResult> GetCashFlow(string symbol)
        {
            var data = await _liveApiService.GetFinancialStatement(symbol, "CASH_FLOW");
            return Ok(data);
        }
    }
}
