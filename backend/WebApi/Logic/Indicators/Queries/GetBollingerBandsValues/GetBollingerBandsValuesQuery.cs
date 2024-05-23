using MediatR;
using WebApi.Dtos;

namespace WebApi.Logic.Indicators.Queries.GetBollingerBandsValues
{
    public class GetBollingerBandsValuesQuery : IRequest<IEnumerable<BollingerBandsDto>>
    {
        public string Ticker { get; set; }
    }
}
