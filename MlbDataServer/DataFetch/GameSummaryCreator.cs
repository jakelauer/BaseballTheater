using MlbDataServer.DataStructures;
using System;

namespace MlbDataServer.DataFetch
{
	public class GameSummaryCreator
	{
		private const string UrlBase = "http://gd2.mlb.com";

		private string BuildUrl(DateTime date)
		{
			var yearFolder = "year_" + date.ToString("yyyy");
			var monthFolder = "month_" + date.ToString("MM");
			var dayFolder = "day_" + date.ToString("dd");

			return UrlBase + "/components/game/mlb/" + yearFolder + "/" + monthFolder + "/" + dayFolder + "/master_scoreboard.xml";
		}

		public GameSummaryCollection GetSummaryCollection(DateTime date)
		{
			var url = BuildUrl(date);
			GameSummaryCollection gameSummaryCollection = null;

			var xmlLoader = new XmlLoader();
			gameSummaryCollection = xmlLoader.GetXml<GameSummaryCollection>(url);

			return gameSummaryCollection;
		}
	}
}