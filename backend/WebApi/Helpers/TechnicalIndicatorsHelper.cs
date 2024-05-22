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
    }
}
