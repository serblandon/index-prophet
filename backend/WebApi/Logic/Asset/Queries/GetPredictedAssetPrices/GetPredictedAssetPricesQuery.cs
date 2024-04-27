using MediatR;
using WebApi.Models;

namespace WebApi.Logic.Asset.Queries.GetPredictedAssetPrices
{
    public class GetPredictedAssetPricesQuery : IRequest<IEnumerable<PredictedPrice>>
    {
        public string Ticker {  get; set; }
        public string PredictionMethod { get; set; }
    }
}
