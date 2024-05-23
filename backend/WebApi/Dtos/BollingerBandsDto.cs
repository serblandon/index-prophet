namespace WebApi.Dtos
{
    public class BollingerBandsDto
    {
        public DateOnly Date { get; set; }
        public decimal? BollingerUpper { get; set; }
        public decimal? BollingerLower { get; set; }
        public decimal? Sma {  get; set; }
    }
}
