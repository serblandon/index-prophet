namespace WebApi.Logic.LivePrice;

public class LivePriceHostedService : IHostedService, IDisposable
{
    private readonly LivePriceService _livePriceService;
    private Timer _timer;

    public LivePriceHostedService(LivePriceService livePriceService)
    {
        _livePriceService = livePriceService;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        _timer = new Timer(UpdatePrices, null, TimeSpan.Zero, TimeSpan.FromMinutes(1));
        return Task.CompletedTask;
    }

    private async void UpdatePrices(object state)
    {
        var symbols = new[] { "SPY", "DIA", "IWM", "QQQ" };
        var tasks = symbols.Select(symbol => _livePriceService.GetLivePrice(symbol));
        await Task.WhenAll(tasks);
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _timer?.Change(Timeout.Infinite, 0);
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        _timer?.Dispose();
    }
}

