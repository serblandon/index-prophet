namespace WebApi.Dtos
{
    public class MACDDto
    {
        public DateOnly Date { get; set; }
        public decimal? Macd { get; set; }
        public decimal? SignalLine { get; set; }
    }
}
