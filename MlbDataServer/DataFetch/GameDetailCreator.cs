using MlbDataServer.DataStructures;

namespace MlbDataServer.DataFetch
{
	public class GameDetailCreator
	{
		private const string UrlBase = "http://gd2.mlb.com";
		
		private string DirectoryUrl { get; set; }
		private string HighlightsXmlUrl { get; set; }
		private string GameCenterXmlUrl { get; set; }
		private string GameSummaryXmlUrl { get; set; }

		public GameDetailCreator(string directory, bool directoryIsFullyQualified = false)
		{
			this.DirectoryUrl = directoryIsFullyQualified 
				? directory
				: UrlBase + directory;

			this.HighlightsXmlUrl = this.DirectoryUrl + "/media/mobile.xml";
			this.GameCenterXmlUrl = this.DirectoryUrl + "/gamecenter.xml";
			this.GameSummaryXmlUrl = this.DirectoryUrl + "/linescore.xml";
		}

		public HighlightsCollection GetHighlights()
		{
			HighlightsCollection highlightsCollection = null;

			var xmlLoader = new XmlLoader();
			highlightsCollection = xmlLoader.GetXml<HighlightsCollection>(HighlightsXmlUrl);

			return highlightsCollection;
		}

		public GameCenter GetGameCenter()
		{
			GameCenter gameCenter = null;

			var xmlLoader = new XmlLoader();
			gameCenter = xmlLoader.GetXml<GameCenter>(GameCenterXmlUrl);

			return gameCenter;
		}

		public GameSummary GetGameSummary()
		{
			GameSummary gameSummary = null;

			var xmlLoader = new XmlLoader();
			gameSummary = xmlLoader.GetXml<GameSummary>(GameSummaryXmlUrl);

			return gameSummary;
		}
	}
}