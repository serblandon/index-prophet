using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json.Linq;

namespace WebApi.Logic.LiveApi
{
    public class LiveApiService
    {
        private readonly HttpClient _httpClient;
        private readonly IMemoryCache _memoryCache;
        private readonly string _apiKey;
        private const string _alphaVantageBaseUrl = "https://www.alphavantage.co/query";

        public LiveApiService(HttpClient httpClient, IMemoryCache memoryCache, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _memoryCache = memoryCache;
            _apiKey = configuration["AlphaVantage:ApiKey"];
        }

        public async Task<(List<Dictionary<string, string>> topGainers, List<Dictionary<string, string>> topLosers)> GetTopGainersAndLosers()
        {
            var cacheKey = "topGainersAndLosers";
            if (_memoryCache.TryGetValue(cacheKey, out (List<Dictionary<string, string>> topGainers, List<Dictionary<string, string>> topLosers) cachedData))
            {
                return cachedData;
            }

            var url = $"{_alphaVantageBaseUrl}?function=TOP_GAINERS_LOSERS&apikey={_apiKey}";
            var response = await _httpClient.GetStringAsync(url);
            var data = JObject.Parse(response);

            var topGainers = data["top_gainers"]
                .Take(3)
                .Select(g => g.Children<JProperty>()
                    .ToDictionary(prop => prop.Name, prop => prop.Value.ToString()))
                .ToList();

            var topLosers = data["top_losers"]
                .Take(3)
                .Select(l => l.Children<JProperty>()
                    .ToDictionary(prop => prop.Name, prop => prop.Value.ToString()))
                .ToList();

            var result = (topGainers, topLosers);

            _memoryCache.Set(cacheKey, result, TimeSpan.FromMinutes(10));

            return result;
        }

        public async Task<Dictionary<string, string>> GetCompanyOverview(string symbol)
        {
            var cacheKey = $"overview-{symbol}";
            if (_memoryCache.TryGetValue(cacheKey, out Dictionary<string, string> cachedData))
            {
                return cachedData;
            }

            var url = $"{_alphaVantageBaseUrl}?function=OVERVIEW&symbol={symbol}&apikey={_apiKey}";
            var response = await _httpClient.GetStringAsync(url);
            var data = JObject.Parse(response);

            var companyOverview = data.Children<JProperty>()
                .ToDictionary(prop => prop.Name, prop => prop.Value.ToString());

            _memoryCache.Set(cacheKey, companyOverview, TimeSpan.FromMinutes(10));

            return companyOverview;
        }

        public async Task<Dictionary<string, string>> GetFinancialStatement(string symbol, string statementType)
        {
            var cacheKey = $"{statementType}-{symbol}";
            if (_memoryCache.TryGetValue(cacheKey, out Dictionary<string, string> cachedData))
            {
                return cachedData;
            }

            var url = $"{_alphaVantageBaseUrl}?function={statementType}&symbol={symbol}&apikey={_apiKey}";
            var response = await _httpClient.GetStringAsync(url);
            var data = JObject.Parse(response);

            var financialStatement = data.Children<JProperty>()
                .ToDictionary(prop => prop.Name, prop => prop.Value.ToString());

            _memoryCache.Set(cacheKey, data, TimeSpan.FromMinutes(10));

            return financialStatement;
        }
    }
}
