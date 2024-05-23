using MediatR;
using WebApi.Dtos;

namespace WebApi.Logic.Indicators.Queries.GetSMAValues
{
    public class GetSMAValuesQuery : IRequest<IEnumerable<SMADto>>
    {
        public string Ticker { get; set; }
    }
}
