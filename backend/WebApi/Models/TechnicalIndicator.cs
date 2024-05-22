namespace WebApi.Models;

public partial class TechnicalIndicator
{
    public int Id { get; set; }

    public string Ticker { get; set; } = null!;

    public DateOnly Date { get; set; }

    public decimal? Rsi { get; set; }

    public decimal? Sma { get; set; }

    public decimal? Macd { get; set; }

    public decimal? SignalLine { get; set; }

    public decimal? BollingerUpper { get; set; }

    public decimal? BollingerLower { get; set; }
}
