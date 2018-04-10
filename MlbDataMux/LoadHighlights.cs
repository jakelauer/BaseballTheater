using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using MlbDataEngine.Contracts;
using MlbDataEngine.Engine;
using Newtonsoft.Json;

namespace MlbDataMux
{
	public class LoadHighlights
	{
		private DateTime Date { get; set; }
		private GameSummaryCreator Gsc { get; set; }

		private IEnumerable<HighlightSearchResult> TempList { get; set; }

		public LoadHighlights(DateTime date)
		{
			this.Date = date;
			this.Gsc = new GameSummaryCreator();
		}

		public void Process()
		{
			GameSummaryCollection summary = null;

			try
			{
				summary = this.Gsc.GetSummaryCollection(this.Date);
			}
			catch (Exception e)
			{

			}

			if (summary?.GameSummaries == null || summary.GameSummaries.Length == 0)
			{
				Logger.Log("Skipping " + this.Date);
				return;
			}

			var tempList = new List<HighlightSearchResult>();

			foreach (var gameSummary in summary.GameSummaries)
			{

				var gdc = new GameDetailCreator(gameSummary.GameDataDirectory);
				HighlightsCollection highlights = null;

				try
				{
					highlights = gdc.GetHighlights();
				}
				catch (Exception e)
				{

				}

				if (highlights?.Highlights == null || highlights.Highlights.Length == 0)
				{
					continue;
				}

				foreach (var highlight in highlights.Highlights)
				{
					highlight.url = highlight.url != null && highlight.url.Length > 0
						? highlight.url.Where(a => a.Contains(".mp4")).ToArray()
						: new string[0];

					if (highlight.url.Length == 0)
					{
						continue;
					}

					var newLocalHighlight = new HighlightSearchResult
					{
						GameId = gameSummary.GamePk,
						Highlight = highlight,
						Thumbnails = HighlightThumbnails.Make(highlight)
					};

					highlight.thumbnails = new string[0];

					tempList.Add(newLocalHighlight);
				}
			}

			this.TempList = tempList;

			if (this.TempList.Any())
			{
				this.JsonSaveAll();
			}
		}

		private void JsonSaveAll()
		{
			Logger.Log($"Saving {this.TempList.Count()} highlights for ${this.Date}");

			var allJson = JsonConvert.SerializeObject(this.TempList);
			var filename = this.Date.ToString("yyyyMMdd") + ".json";
			var filePath = @"C:/highlightdata/" + filename;
			
			using (var sw = File.CreateText(filePath))
			{
				sw.Write(allJson);
			}
		}

	}
}