using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using MlbDataServer.Contracts;
using MlbDataServer.Engine;
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

			Logger.Log("Loading games for " + Date);

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
					var newLocalHighlight = new HighlightSearchResult
					{
						GameId = gameSummary.GamePk,
						Highlight = highlight
					};

					tempList.Add(newLocalHighlight);
				}
			}

			this.TempList = tempList;

			this.JsonSaveAll();
			//this.SqlInsertAll();
		}

		private void JsonSaveAll()
		{
			Logger.Log($"Saving {this.TempList.Count()} highlights");

			var allJson = JsonConvert.SerializeObject(this.TempList);
			var filename = this.Date.ToString("yyyyMMdd") + ".json";
			var filePath = @"C:/highlightdata/" + filename;

			if (!File.Exists(filePath))
			{
				using (var sw = File.CreateText(filePath))
				{
					sw.Write(allJson);
				}
			}
		}

	}
}