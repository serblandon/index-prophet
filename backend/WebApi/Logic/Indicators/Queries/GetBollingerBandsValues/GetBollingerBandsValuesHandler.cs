using MediatR;
using Microsoft.EntityFrameworkCore;
using WebApi.Data;
using WebApi.Dtos;

namespace WebApi.Logic.Indicators.Queries.GetBollingerBandsValues
{
    public class GetBollingerBandsValuesHandler : IRequestHandler<GetBollingerBandsValuesQuery, IEnumerable<BollingerBandsDto>>
    {
        private readonly IndexProphetContext _indexProphetContext;
        public GetBollingerBandsValuesHandler(IndexProphetContext indexProphetContext)
        {
            _indexProphetContext = indexProphetContext;
        }

        public async Task<IEnumerable<BollingerBandsDto>> Handle(GetBollingerBandsValuesQuery request, CancellationToken cancellationToken)
        {
            var bollingerValues = await _indexProphetContext.TechnicalIndicators.Where(entry => entry.Ticker == request.Ticker && entry.BollingerLower != null && entry.BollingerLower != null)
                                                                        .Select(entry => new BollingerBandsDto
                                                                        {
                                                                            Date = entry.Date,
                                                                            BollingerLower = entry.BollingerLower,
                                                                            BollingerUpper = entry.BollingerUpper,
                                                                        })
                                                                        .OrderBy(x => x.Date).ToListAsync(cancellationToken);

            return bollingerValues;
        }
    }
}
