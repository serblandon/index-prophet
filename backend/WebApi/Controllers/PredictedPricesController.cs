using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using WebApi.Logic.Asset.Queries.GetPredictedAssetPrices;
using WebApi.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PredictedPricesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PredictedPricesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("[action]/{ticker}/{predictionMethod}")]
        [ProducesResponseType(typeof(IEnumerable<PredictedPrice>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetPredictedAssetPricesAscendingAsync(string ticker, string predictionMethod)
        {
            ticker = ticker.ToUpper();

            var response = await _mediator.Send(new GetPredictedAssetPricesQuery() { Ticker = ticker, PredictionMethod = predictionMethod });

            if (!response.Any())
            {
                return NotFound();
            }

            return Ok(response);
        }
    }
}
