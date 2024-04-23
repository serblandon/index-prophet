using MediatR;
using Microsoft.EntityFrameworkCore;
using WebApi.Data;
using WebApi.Models;

namespace WebApi.Logic.Asset.Queries.GetHistoricalAssetPrices
{
    public class GetHistoricalAssetPricesHandler : IRequestHandler<GetHistoricalAssetPricesQuery, IEnumerable<HistoricalPrice>>
    {
        private readonly IndexProphetContext _indexProphetContext;

        public GetHistoricalAssetPricesHandler(IndexProphetContext indexProphetContext)
        {
            _indexProphetContext = indexProphetContext;
        }

        public async Task<IEnumerable<HistoricalPrice>> Handle(GetHistoricalAssetPricesQuery request, CancellationToken cancellationToken)
        {
            var historicalAssetPrices = await _indexProphetContext.HistoricalPrices.Where(entry => entry.Ticker == request.Ticker).OrderBy(x => x.Date).ToListAsync(cancellationToken);

            return historicalAssetPrices;
        }
    }
}
