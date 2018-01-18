using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace MlbDataServer.DataFetch
{
	public class Search
	{
		public static DataTable SearchHighlights(string query, int page, int recordsPerPage)
		{
			var words = query.Split(' ');
			var newQuery = string.Join(" AND ", words);

			var data = SqlRunner.RunSproc("dbo.search_highlights", new[]
			{
				new SprocParam("query", SqlDbType.NVarChar, newQuery),
				new SprocParam("page", SqlDbType.Int, page),
				new SprocParam("recsPerPage", SqlDbType.Int, recordsPerPage), 
			});

			return data;
		}
	}
}