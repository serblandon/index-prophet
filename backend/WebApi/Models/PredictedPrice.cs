namespace WebApi.Models;

public partial class PredictedPrice
{
    public int Id { get; set; }

    public string Ticker { get; set; } = null!;

    public DateOnly Date { get; set; }

    public decimal AdjClosePrice { get; set; }

    public string PredictionMethod { get; set; } = null!;
}
