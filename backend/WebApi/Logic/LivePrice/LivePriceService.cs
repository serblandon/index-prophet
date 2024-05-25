using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json.Linq;

namespace WebApi.Logic.LivePrice;

public class LivePriceService
{
    private readonly HttpClient _httpClient;
    private readonly IMemoryCache _memorycache;
    private readonly string _apiKey;

    public LivePriceService(HttpClient httpClient, IMemoryCache memoryCache, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _memorycache = memoryCache;
        _apiKey = configuration["AlphaVantage:ApiKey"];
    }

    public async Task<decimal?> GetLivePrice(string symbol)
    {
        if (_memorycache.TryGetValue(symbol, out decimal cachedPrice))
        {
            return cachedPrice;
        }

        var url = $"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={_apiKey}";
        var response = await _httpClient.GetStringAsync(url);
        var data = JObject.Parse(response);
        var priceToken = data["Global Quote"]?["05. price"];

        if (priceToken != null && decimal.TryParse(priceToken.ToString(), out decimal price))
        {
            _memorycache.Set(symbol, price, TimeSpan.FromMinutes(1));

            return price;
        }

        return null;
    }
}
