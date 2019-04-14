using System;
using System.Collections.Generic;
using System.Linq;
using MlbDataEngine.Contracts;

namespace MlbDataEngine.Engine
{
	public static class Search
	{
		public static IEnumerable<HighlightSearchResultJson> SearchHighlights(SearchQuery query, int page, int recordsPerPage)
		{
			var words = query.Text.Split(' ');
			var upperWords = words.Select(a => a.ToUpperInvariant());

			if (HighlightDatabase.AllHighlights == null) 
				return new List<HighlightSearchResultJson>();
			
			var matches = HighlightDatabase.AllHighlights.Where(highlightResult =>
			{
				if (highlightResult?.highlight == null) return false;

				var checkAgainst = $"{highlightResult.highlight.headline ?? ""} {highlightResult.highlight.blurb ?? ""} {highlightResult.highlight.kicker ?? ""} {highlightResult.highlight.description ?? ""}";

				checkAgainst = checkAgainst.ToUpperInvariant();

				var checkAgainstFixed = new string(checkAgainst.Select(c => char.IsPunctuation(c) ? ' ' : c).ToArray());

				var matched = upperWords.All(checkAgainstFixed.Contains);

				if (query.GameIds != null)
				{
					matched = matched && query.GameIds.Contains(highlightResult.game_pk);
				}

				return matched;

			});

			return matches
				.OrderByDescending(a => DateTime.Parse(a.highlight.date))
				.Skip(page * recordsPerPage)
				.Take(recordsPerPage);

		}
	}

	public class SearchQuery
	{
		public string Text { get; }
		public IEnumerable<string> GameIds { get; }

		public SearchQuery(string text, string gameIdCsv = null)
		{
			this.Text = text;

			if (gameIdCsv != null)
			{
				this.GameIds = gameIdCsv.Split(',').Select(a => a);
			}
		}
	}
}