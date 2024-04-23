using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using WebApi.Logic.Asset.Queries.GetHistoricalAssetPrices;
using WebApi.Models;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HistoricalPricesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public HistoricalPricesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("[action]/{ticker}")]
        [ProducesResponseType(typeof(IEnumerable<HistoricalPrice>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetHistoricalAssetPricesAscending(string ticker)
        {
            var response = await _mediator.Send(new GetHistoricalAssetPricesQuery() { Ticker = ticker} );

            if (!response.Any())
            {
                return NotFound();
            }

            return Ok(response);
        }
    }
}
