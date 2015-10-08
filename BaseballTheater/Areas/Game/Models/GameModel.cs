using MlbDataServer.DataFetch;
using MlbDataServer.DataStructures;
using System;
using System.Linq;
using System.Net;

namespace BaseballTheater.Areas.Game.Models
{
	public class GameModel
	{
		public GameSummary GameSummary { get; set; }
		public HighlightsCollection HighlightsCollection { get; set; }

		public GameModel(DateTime date, int gamePk)
		{
			var gameSummaryCreator = new GameSummaryCreator();
			var gameCollection = gameSummaryCreator.GetSummaryCollection(date);
			this.GameSummary = gameCollection.GameSummaries.FirstOrDefault(game => game.GamePk == gamePk);
			if (this.GameSummary == default(GameSummary)) return;


			var gameDetailCreator = new GameDetailCreator(this.GameSummary.GameDataDirectory);
			HighlightsCollection = gameDetailCreator.GetHighlights();
			if (HighlightsCollection == default(HighlightsCollection)) return;


			foreach (var highlight in HighlightsCollection.Highlights)
			{
				for (var i = 0; i < highlight.Urls.Length; i++)
				{
					var url = highlight.Urls[i];

					if (url.Contains("1200K"))
					{
						var testUrl = url.Replace("1200K", "1800K");
						if (RemoteFileExists(testUrl))
						{
							highlight.Urls[i] = testUrl;
						}
					}
				}
			}
		}

		public bool RemoteFileExists(string url)
		{
			try
			{
				var request = WebRequest.Create(url) as HttpWebRequest;
				if (request == null) return false;

				request.Method = "HEAD";
				var response = request.GetResponse() as HttpWebResponse;
				return response != null && (response.StatusCode == HttpStatusCode.OK);
			}
			catch
			{
				//Any exception will returns false.
				return false;
			}
		}
	}
}