﻿using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using WebApi.Logic.Asset.Queries.GetHistoricalAssetPrices;
using WebApi.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HistoricalPricesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public HistoricalPricesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("[action]/{ticker}")]
        [ProducesResponseType(typeof(IEnumerable<HistoricalPrice>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetHistoricalAssetPricesAscendingAsync(string ticker)
        {
            ticker = ticker.ToUpper();

            var response = await _mediator.Send(new GetHistoricalAssetPricesQuery() { Ticker = ticker} );

            if (!response.Any())
            {
                return NotFound();
            }

            return Ok(response);
        }
    }
}
