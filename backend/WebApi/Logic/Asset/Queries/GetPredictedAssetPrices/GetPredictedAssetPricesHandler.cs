using MediatR;
using Microsoft.EntityFrameworkCore;
using WebApi.Data;
using WebApi.Models;

namespace WebApi.Logic.Asset.Queries.GetPredictedAssetPrices
{
    public class GetPredictedAssetPricesHandler : IRequestHandler<GetPredictedAssetPricesQuery, IEnumerable<PredictedPrice>>
    {
        private readonly IndexProphetContext _indexProphetContext;

        public GetPredictedAssetPricesHandler(IndexProphetContext indexProphetContext)
        {
            _indexProphetContext = indexProphetContext;
        }

        public async Task<IEnumerable<PredictedPrice>> Handle(GetPredictedAssetPricesQuery request, CancellationToken cancellationToken)
        {
            var predictedAssetPrices = await _indexProphetContext.PredictedPrices.Where(entry => entry.Ticker == request.Ticker && entry.PredictionMethod == request.PredictionMethod)
                                                                                .OrderBy(x => x.Date)
                                                                                .ToListAsync(cancellationToken);

            return predictedAssetPrices;
        }
    }
}
