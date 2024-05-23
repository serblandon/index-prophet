using MediatR;

namespace WebApi.Logic.Indicators.Commands.UpdateBollingerBandsValues
{
    public class AddBollingerBandsValuesCommand : IRequest<Unit>
    {
        public string Ticker { get; set; }
    }
}
