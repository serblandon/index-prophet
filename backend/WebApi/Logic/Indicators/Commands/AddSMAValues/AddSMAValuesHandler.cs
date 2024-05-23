using MediatR;
using Microsoft.EntityFrameworkCore;
using WebApi.Data;
using WebApi.Helpers;
using WebApi.Models;

namespace WebApi.Logic.Indicators.Commands.AddSMAValues
{
    public class AddSMAValuesHandler : IRequestHandler<AddSMAValuesCommand, Unit>
    {
        private readonly IndexProphetContext _indexProphetContext;
        private readonly TechnicalIndicatorsHelper _technicalIndicatorsHelper;
        private const int Period = 14;

        public AddSMAValuesHandler(IndexProphetContext indexProphetContext, TechnicalIndicatorsHelper technicalIndicatorsHelper)
        {
            _indexProphetContext = indexProphetContext;
            _technicalIndicatorsHelper = technicalIndicatorsHelper;

        }

        public async Task<Unit> Handle(AddSMAValuesCommand request, CancellationToken cancellationToken)
        {
            var historicalData = await _indexProphetContext.HistoricalPrices
                .Where(h => h.Ticker == request.Ticker)
                .OrderBy(h => h.Date)
                .ToListAsync(cancellationToken);

            var smaValues = _technicalIndicatorsHelper.CalculateSMA(historicalData, 14);

            for (int i = 0; i < smaValues.Count; i++)
            {
                var date = historicalData[i + Period - 1].Date;

                var technicalIndicator = await _indexProphetContext.TechnicalIndicators
                    .FirstOrDefaultAsync(t => t.Ticker == request.Ticker && t.Date == date, cancellationToken);

                if (technicalIndicator == null)
                {
                    technicalIndicator = new TechnicalIndicator
                    {
                        Ticker = request.Ticker,
                        Date = date,
                        Sma = smaValues[i]
                    };
                    await _indexProphetContext.TechnicalIndicators.AddAsync(technicalIndicator, cancellationToken);
                }
                else
                {
                    technicalIndicator.Sma = smaValues[i];
                    _indexProphetContext.TechnicalIndicators.Update(technicalIndicator);
                }
            }

            await _indexProphetContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
