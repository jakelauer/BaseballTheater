using System;
using System.Collections.Generic;
using System.Linq;
using MlbDataEngine.Contracts;

namespace MlbDataEngine.Engine
{
	public static class Search
	{
		public static IEnumerable<HighlightSearchResult> SearchHighlights(SearchQuery query, int page, int recordsPerPage)
		{
			var words = query.Text.Split(' ');
			var upperWords = words.Select(a => a.ToUpperInvariant());

			if (HighlightDatabase.AllHighlights == null) 
				return new List<HighlightSearchResult>();
			
			var matches = HighlightDatabase.AllHighlights.Where(highlightResult =>
			{
				if (highlightResult?.Highlight == null) return false;

				var checkAgainst = $"{highlightResult.Highlight.headline ?? ""} {highlightResult.Highlight.bigblurb ?? ""} {highlightResult.Highlight.blurb ?? ""}";

				if (highlightResult.Highlight.team?.Name != null)
				{
					checkAgainst += " " + highlightResult.Highlight.team.Name + " ";
				}

				if (highlightResult.Highlight.players?.Names != null)
				{
					checkAgainst += " " + highlightResult.Highlight.players.Names + " ";
				}

				checkAgainst = checkAgainst.ToUpperInvariant();

				var checkAgainstFixed = new string(checkAgainst.Select(c => char.IsPunctuation(c) ? ' ' : c).ToArray());

				var matched = upperWords.All(checkAgainstFixed.Contains);

				if (query.GameIds != null)
				{
					matched = matched && query.GameIds.Contains(highlightResult.GameId);
				}

				return matched;

			});

			return matches
				.OrderByDescending(a => a.Highlight.dateObj)
				.Skip(page * recordsPerPage)
				.Take(recordsPerPage);

		}
	}

	public class SearchQuery
	{
		public string Text { get; }
		public IEnumerable<long> GameIds { get; }

		public SearchQuery(string text, string gameIdCsv = null)
		{
			this.Text = text;

			if (gameIdCsv != null)
			{
				this.GameIds = gameIdCsv.Split(',').Select(a => Convert.ToInt64(a));
			}
		}
	}
}