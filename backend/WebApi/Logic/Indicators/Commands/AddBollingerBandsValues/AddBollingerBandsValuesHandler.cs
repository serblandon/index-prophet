using MediatR;
using Microsoft.EntityFrameworkCore;
using WebApi.Data;
using WebApi.Helpers;
using WebApi.Models;

namespace WebApi.Logic.Indicators.Commands.UpdateBollingerBandsValues
{
    public class AddBollingerBandsValuesHandler : IRequestHandler<AddBollingerBandsValuesCommand, Unit>
    {
        private readonly IndexProphetContext _indexProphetContext;
        private readonly TechnicalIndicatorsHelper _technicalIndicatorsHelper;
        private const int Period = 20;
        private const int Multiplier = 2;
        public AddBollingerBandsValuesHandler(IndexProphetContext indexProphetContext, TechnicalIndicatorsHelper technicalIndicatorsHelper)
        {
            _indexProphetContext = indexProphetContext;
            _technicalIndicatorsHelper = technicalIndicatorsHelper;
        }

        public async Task<Unit> Handle(AddBollingerBandsValuesCommand request, CancellationToken cancellationToken)
        {
            var historicalData = await _indexProphetContext.HistoricalPrices
                .Where(h => h.Ticker == request.Ticker)
                .OrderBy(h => h.Date)
                .ToListAsync(cancellationToken);

            var smaValues = _indexProphetContext.TechnicalIndicators
                .Where(t => t.Ticker == request.Ticker && t.Sma != null)
                .OrderBy(t => t.Date)
                .Select(t => new { t.Date, t.Sma })
                .ToList();

            var bollingerBands = _technicalIndicatorsHelper.CalculateBollingerBands(historicalData, Period, Multiplier);

            foreach (var band in bollingerBands)
            {
                var technicalIndicator = await _indexProphetContext.TechnicalIndicators
                    .FirstOrDefaultAsync(t => t.Ticker == request.Ticker && t.Date == band.Date, cancellationToken);

                if (technicalIndicator is null)
                {
                    technicalIndicator = new TechnicalIndicator
                    {
                        Ticker = request.Ticker,
                        Date = band.Date,
                        Sma = smaValues.FirstOrDefault(s => s.Date == band.Date)?.Sma,
                        BollingerUpper = band.UpperBand,
                        BollingerLower = band.LowerBand
                    };
                    await _indexProphetContext.TechnicalIndicators.AddAsync(technicalIndicator, cancellationToken);
                }
                else
                {
                    technicalIndicator.Sma = smaValues.FirstOrDefault(s => s.Date == band.Date)?.Sma;
                    technicalIndicator.BollingerUpper = band.UpperBand;
                    technicalIndicator.BollingerLower = band.LowerBand;
                    _indexProphetContext.TechnicalIndicators.Update(technicalIndicator);
                }
            }

            await _indexProphetContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
