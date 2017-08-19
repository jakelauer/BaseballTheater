using MlbDataServer.DataStructures.Fangraphs;

namespace MlbDataServer.DataFetch
{
	public class NewsFeedCreator
	{
		private const string FangraphsUrl = "http://www.fangraphs.com/blogs/feed/";
		private const string MlbUrl = "http://mlb.mlb.com/partnerxml/gen/news/rss/mlb.xml";

		public NewsFeedCreator()
		{
		}

		public RssFeed GetFangraphsFeed()
		{
			RssFeed feed = null;

			var xmlLoader = new XmlLoader();
			feed = xmlLoader.GetXml<RssFeed>(FangraphsUrl);

			return feed;
		}

		public RssFeed GetMlbFeed()
		{
			RssFeed feed = null;

			var xmlLoader = new XmlLoader();
			feed = xmlLoader.GetXml<RssFeed>(MlbUrl);

			return feed;
		}
	}
}