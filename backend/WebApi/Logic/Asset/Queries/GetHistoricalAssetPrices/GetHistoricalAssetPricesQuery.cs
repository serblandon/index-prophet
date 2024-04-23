using MediatR;
using WebApi.Models;

namespace WebApi.Logic.Asset.Queries.GetHistoricalAssetPrices
{
    public class GetHistoricalAssetPricesQuery : IRequest<IEnumerable<HistoricalPrice>>
    {
        public string Ticker { get; set; }
    }
}
