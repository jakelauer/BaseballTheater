using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using MlbDataServer.Contracts;

namespace MlbDataServer.Engine
{
	public class Search
	{
		public static IEnumerable<HighlightSearchResult> SearchHighlights(string query, int page, int recordsPerPage)
		{
			var words = query.Split(' ');
			var upperWords = words.Select(a => a.ToUpperInvariant());

			var matches = HighlightDatabase.AllHighlights.Where(a =>
			{
				if (a?.Highlight == null) return false;

				var checkAgainst = $"{a.Highlight.Headline ?? ""} {a.Highlight.BigBlurb ?? ""} {a.Highlight.Blurb ?? ""}";
					
				if (a.Highlight.Team?.Name != null)
				{
					checkAgainst += " " + a.Highlight.Team.Name + " ";
				}

				if (a.Highlight.Players?.Names != null)
				{
					checkAgainst += " " + a.Highlight.Players.Names + " ";
				}

				checkAgainst = checkAgainst.ToUpperInvariant();

				var checkAgainstFixed = new string(checkAgainst.Select(c => char.IsPunctuation(c) ? ' ' : c).ToArray());

				var matched = upperWords.All(checkAgainstFixed.Contains);

				return matched;

			});

			return matches
				.OrderByDescending(a => a.Highlight.DateObj)
				.Skip(page * recordsPerPage)
				.Take(recordsPerPage);
		}
	}
}