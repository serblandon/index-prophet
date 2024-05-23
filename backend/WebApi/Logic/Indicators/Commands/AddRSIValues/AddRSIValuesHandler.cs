using MediatR;
using Microsoft.EntityFrameworkCore;
using WebApi.Data;
using WebApi.Helpers;
using WebApi.Models;

namespace WebApi.Logic.Indicators.Commands.UpdateRSIValues
{
    public class AddRSIValuesHandler : IRequestHandler<AddRSIValuesCommand, Unit>
    {
        private readonly IndexProphetContext _indexProphetContext;
        private readonly TechnicalIndicatorsHelper _technicalIndicatorsHelper;
        private const int Period = 14;
        public AddRSIValuesHandler(IndexProphetContext indexProphetContext, TechnicalIndicatorsHelper technicalIndicatorsHelper)
        {
            _indexProphetContext = indexProphetContext;
            _technicalIndicatorsHelper = technicalIndicatorsHelper;
        }

        public async Task<Unit> Handle(AddRSIValuesCommand request, CancellationToken cancellationToken)
        {
            var historicalData = await _indexProphetContext.HistoricalPrices
                .Where(h => h.Ticker == request.Ticker)
                .OrderBy(h => h.Date)
                .ToListAsync(cancellationToken);

            var rsiValues = _technicalIndicatorsHelper.CalculateRSI(historicalData, Period);

            for (int i = 0; i < rsiValues.Count; i++)
            {
                var date = historicalData[i + Period].Date;

                var technicalIndicator = await _indexProphetContext.TechnicalIndicators
                    .FirstOrDefaultAsync(entry => entry.Ticker == request.Ticker && entry.Date == date, cancellationToken);

                if (technicalIndicator is null)
                {
                    technicalIndicator = new TechnicalIndicator
                    {
                        Ticker = request.Ticker,
                        Date = date,
                        Rsi = rsiValues[i]
                    };
                    await _indexProphetContext.TechnicalIndicators.AddAsync(technicalIndicator, cancellationToken);
                }
                else
                {
                    technicalIndicator.Rsi = rsiValues[i];
                    _indexProphetContext.TechnicalIndicators.Update(technicalIndicator);
                }
            }

            await _indexProphetContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
