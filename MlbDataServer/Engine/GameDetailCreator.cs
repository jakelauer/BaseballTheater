using System.Collections.Generic;
using System.Net;
using Common;
using MlbDataServer.Contracts;

namespace MlbDataServer.Engine
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

		public Dictionary<string, string> GetGameCenterHeaders()
		{
			var headers = new Dictionary<string, string>();
			var webRequest = WebRequest.Create(GameCenterXmlUrl);
			webRequest.Method = "HEAD";
			using (var webResponse = webRequest.GetResponse())
			{
				foreach (string header in webResponse.Headers)
				{
					headers.Add(header, webResponse.Headers[header]);
				}
			}

			return headers;
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