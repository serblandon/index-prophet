using Microsoft.EntityFrameworkCore;
using WebApi.Models;

namespace WebApi.Helpers
{
    public class TechnicalIndicatorsHelper
    {
        public List<decimal> CalculateRSI(List<HistoricalPrice> data, int period)
        {
            var rsiValues = new List<decimal>();
            if (data.Count < period) return rsiValues;

            var gains = new List<decimal>();
            var losses = new List<decimal>();

            for (int i = 1; i < data.Count; i++)
            {
                var change = data[i].AdjClosePrice - data[i - 1].AdjClosePrice;
                if (change > 0)
                {
                    gains.Add(change);
                    losses.Add(0);
                }
                else
                {
                    gains.Add(0);
                    losses.Add(-change);
                }
            }

            var avgGain = gains.Take(period).Average();
            var avgLoss = losses.Take(period).Average();

            if (avgLoss == 0)
            {
                rsiValues.Add(100);
            }
            else
            {
                rsiValues.Add(100 - (100 / (1 + (avgGain / avgLoss))));
            }

            for (int i = period; i < gains.Count; i++)
            {
                avgGain = ((avgGain * (period - 1)) + gains[i]) / period;
                avgLoss = ((avgLoss * (period - 1)) + losses[i]) / period;

                if (avgLoss == 0)
                {
                    rsiValues.Add(100);
                }
                else
                {
                    rsiValues.Add(100 - (100 / (1 + (avgGain / avgLoss))));
                }
            }

            return rsiValues;
        }

        public List<decimal> CalculateSMA(List<HistoricalPrice> data, int period)
        {
            var smaValues = new List<decimal>();
            if (data.Count < period) return smaValues;

            for (int i = 0; i <= data.Count - period; i++)
            {
                var periodData = data.Skip(i).Take(period).Select(h => h.AdjClosePrice).ToList();
                var sma = periodData.Average();
                smaValues.Add(sma);
            }

            return smaValues;
        }

        public List<(DateOnly Date, decimal UpperBand, decimal LowerBand)> CalculateBollingerBands(List<HistoricalPrice> data, int period = 20, int multiplier = 2)
        {
            var bollingerBands = new List<(DateOnly Date, decimal UpperBand, decimal LowerBand)>();

            var smaValues = data.Select(d => d.AdjClosePrice).Take(data.Count - period + 1).ToList();

            for (int i = period - 1; i < data.Count; i++)
            {
                var periodData = data.Skip(i - period + 1).Take(period).ToList();
                var stdDev = CalculateStandardDeviation(periodData.Select(p => p.AdjClosePrice).ToList());
                var upperBand = smaValues[i - period + 1] + (stdDev * multiplier);
                var lowerBand = smaValues[i - period + 1] - (stdDev * multiplier);

                bollingerBands.Add((data[i].Date, upperBand, lowerBand));
            }

            return bollingerBands;
        }

        private decimal CalculateStandardDeviation(List<decimal> values)
        {
            if (values.Count == 0) return 0;

            var average = values.Average();
            var sumOfSquaresOfDifferences = values.Select(val => (val - average) * (val - average)).Sum();
            var stdDev = (decimal)Math.Sqrt((double)(sumOfSquaresOfDifferences / values.Count));

            return stdDev;
        }
    }
}
