using MediatR;
using Microsoft.EntityFrameworkCore;
using WebApi.Data;
using WebApi.Dtos;

namespace WebApi.Logic.Indicators.Queries.GetRSIValues
{
    public class GetRSIValuesHandler : IRequestHandler<GetRSIValuesQuery, IEnumerable<RSIDto>>
    {
        private readonly IndexProphetContext _indexProphetContext;
        public GetRSIValuesHandler(IndexProphetContext indexProphetContext)
        {
            _indexProphetContext = indexProphetContext;
        }

        public async Task<IEnumerable<RSIDto>> Handle(GetRSIValuesQuery request, CancellationToken cancellationToken)
        {
            var rsiValues = await _indexProphetContext.TechnicalIndicators.Where(entry => entry.Ticker == request.Ticker && entry.Rsi != null)
                                                                        .Select(entry => new RSIDto
                                                                        {
                                                                            Date = entry.Date,
                                                                            Rsi = entry.Rsi,
                                                                        })
                                                                        .OrderBy(x => x.Date).ToListAsync(cancellationToken);

            return rsiValues;
        }
    }
}
