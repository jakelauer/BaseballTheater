using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using MlbDataServer.Contracts;

namespace MlbDataServer.Engine
{
	public class Search
	{
		public static IEnumerable<LocalHighlight> SearchHighlights(string query, int page, int recordsPerPage)
		{
			var words = query.Split(' ');
			var upperWords = words.Select(a => a.ToUpperInvariant());

			var matches = HighlightDatabase.AllHighlights.Where(a =>
			{

				var checkAgainst = $"{a.PlayerNames ?? ""} {a.Headline ?? ""} {a.TeamName ?? ""} {a.BigBlurb ?? ""}".ToUpperInvariant();
				var checkAgainstFixed = new string(checkAgainst.Select(c => char.IsPunctuation(c) ? ' ' : c).ToArray());

				var matched = upperWords.All(checkAgainstFixed.Contains);

				return matched;
			});

			return matches
				.OrderByDescending(a => a.Date)
				.Skip(page * recordsPerPage)
				.Take(recordsPerPage);
		}
	}
}