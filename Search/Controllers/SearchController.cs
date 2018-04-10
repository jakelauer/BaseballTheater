using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using MlbDataEngine.Contracts;

namespace Search.Controllers
{
	[Route("api/[controller]")]
	public class SearchController : Controller
	{
		[HttpGet("[action]")]
		public IEnumerable<HighlightSearchResult> Highlights(string query, int page, int perpage)
		{
			return MlbDataEngine.Engine.Search.SearchHighlights(query, page, perpage);
		}
	}
}
