using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using WebApi.Dtos;
using WebApi.Logic.Indicators.Queries.GetRSIValues;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TechnicalIndicatorsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public TechnicalIndicatorsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("[action]/{ticker}/rsi")]
        [ProducesResponseType(typeof(IEnumerable<RSIDto>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetPredictedAssetPricesAscendingAsync(string ticker)
        {
            ticker = ticker.ToUpper();

            var response = await _mediator.Send(new GetRSIValuesQuery() { Ticker = ticker });

            if (!response.Any())
            {
                return NotFound();
            }

            return Ok(response);
        }
    }
}
