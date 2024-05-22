using MediatR;
using WebApi.Dtos;

namespace WebApi.Logic.Indicators.Queries.GetRSIValues
{
    public class GetRSIValuesQuery : IRequest<IEnumerable<RSIDto>>
    {
        public string Ticker { get; set; }
    }
}
