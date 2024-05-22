using MediatR;

namespace WebApi.Logic.Indicators.Commands.UpdateRSIValues
{
    public class AddRSIValuesCommand : IRequest<Unit>
    {
        public string Ticker { get; set; }
    }
}
