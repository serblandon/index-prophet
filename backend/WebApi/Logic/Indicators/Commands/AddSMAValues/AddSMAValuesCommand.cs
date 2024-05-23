
using MediatR;

namespace WebApi.Logic.Indicators.Commands.AddSMAValues
{
    public class AddSMAValuesCommand : IRequest<Unit>
    {
        public string Ticker { get; set; }
    }
}

