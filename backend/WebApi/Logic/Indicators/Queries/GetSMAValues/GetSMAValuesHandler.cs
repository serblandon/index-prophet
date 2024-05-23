using MediatR;
using Microsoft.EntityFrameworkCore;
using WebApi.Data;
using WebApi.Dtos;

namespace WebApi.Logic.Indicators.Queries.GetSMAValues
{
    public class GetSMAValuesHandler : IRequestHandler<GetSMAValuesQuery, IEnumerable<SMADto>>
    {
        private readonly IndexProphetContext _indexProphetContext;
        public GetSMAValuesHandler(IndexProphetContext indexProphetContext)
        {
            _indexProphetContext = indexProphetContext;
        }

        public async Task<IEnumerable<SMADto>> Handle(GetSMAValuesQuery request, CancellationToken cancellationToken)
        {
            var smaValues = await _indexProphetContext.TechnicalIndicators.Where(entry => entry.Ticker == request.Ticker && entry.Sma != null)
                                                                        .Select(entry => new SMADto
                                                                        {
                                                                            Date = entry.Date,
                                                                            Sma = entry.Sma,
                                                                        })
                                                                        .OrderBy(x => x.Date).ToListAsync(cancellationToken);

            return smaValues;
        }
    }
}
