using Common;
using MlbDataServer.Contracts.News;

namespace MlbDataServer.Engine
{
	public class NewsFeedCreator
	{
		private const string FangraphsUrl = "http://www.fangraphs.com/blogs/feed/";
		private const string MlbUrl = "http://mlb.mlb.com/partnerxml/gen/news/rss/mlb.xml";

		public NewsFeedCreator()
		{
		}

		public RssFeed GetFeed(string url)
		{
			var xmlLoader = new XmlLoader();
			var feed = xmlLoader.GetXml<RssFeed>(url);

			return feed;
		}

		public RssFeed GetAtomFeed(string url)
		{
			var xmlLoader = new XmlLoader();
			var atomFeed = xmlLoader.GetXml<AtomFeed>(url);

			var rssFeed = new RssFeed(atomFeed);

			return rssFeed;
		}
	}
}