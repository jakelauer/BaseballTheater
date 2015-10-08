using MlbDataServer.DataStructures;

namespace MlbDataServer.DataFetch
{
	public class GameDetailCreator
	{
		private const string UrlBase = "http://gd2.mlb.com";
		
		private string DirectoryUrl { get; set; }
		private string HighlightsXmlUrl { get; set;}

		public GameDetailCreator(string directory)
		{
			this.DirectoryUrl = UrlBase + directory;
			this.HighlightsXmlUrl = this.DirectoryUrl + "/media/highlights.xml";
		}

		public HighlightsCollection GetHighlights()
		{
			HighlightsCollection highlightsCollection = null;

			var xmlLoader = new XmlLoader();
			highlightsCollection = xmlLoader.GetXml<HighlightsCollection>(HighlightsXmlUrl);

			return highlightsCollection;
		}
	}
}