using Microsoft.AspNetCore.Mvc;
using WebApi.Logic.LivePrice;

[ApiController]
[Route("api/[controller]")]
public class LivePriceController : ControllerBase
{
    private readonly LivePriceService _livePriceService;

    public LivePriceController(LivePriceService livePriceService)
    {
        _livePriceService = livePriceService;
    }

    [HttpGet("latestPrice")]
    public async Task<IActionResult> GetLatestPrices()
    {
        var symbols = new[] { "SPY", "DIA", "IWM", "QQQ" };
        var tasks = symbols.Select(symbol => _livePriceService.GetLivePrice(symbol));
        var prices = await Task.WhenAll(tasks);

        var result = symbols.Zip(prices, (symbol, price) => new { Symbol = symbol, Price = price })
                            .Where(x => x.Price.HasValue)
                            .Select(x => new { x.Symbol, x.Price });

        return Ok(result);
    }
}
