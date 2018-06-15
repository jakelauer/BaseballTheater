using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using MlbDataEngine.Contracts;
using MlbDataEngine.Engine;

namespace Search.Controllers
{
	[Route("api/[controller]")]
	public class SearchController : Controller
	{
		[HttpGet("[action]")]
		public IEnumerable<HighlightSearchResult> Highlights(string query, int page, int perpage, string gameIds = null)
		{
			var searchQuery = new SearchQuery(query, gameIds);
			
			return MlbDataEngine.Engine.Search.SearchHighlights(searchQuery, page, perpage);
		}
	}
}
