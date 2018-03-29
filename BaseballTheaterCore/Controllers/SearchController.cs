using System.Collections.Generic;
using System.Net;
using BaseballTheaterCore.Models;
using Common;
using Microsoft.AspNetCore.Mvc;
using MlbDataEngine.Contracts;
using MlbDataEngine.Engine;

namespace BaseballTheaterCore.Controllers
{
    [Route("api/[controller]")]
    public class SearchController : Controller
    {
        [HttpGet("[action]")]
        public IEnumerable<HighlightSearchResult> Highlights(string query, int page, int perpage)
        {
            return Search.SearchHighlights(query, page, perpage);
        }
    }
}
