using MlbDataServer.DataFetch;
using MlbDataServer.DataStructures.News;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BaseballTheater.Areas.Data.Models.News
{
	public class NewsModel
	{
		private IEnumerable<NewsFeeds> Feeds { get; }

		public IEnumerable<RssItem> Item { get; set; }

		private static readonly Dictionary<NewsFeeds, string> FeedUrls = new Dictionary<NewsFeeds, string>
		{
			{NewsFeeds.espn, "http://www.espn.com/espn/rss/mlb/news"},
			{NewsFeeds.fangraphs, "http://www.fangraphs.com/blogs/feed/"},
			{NewsFeeds.fivethirtyeight, "https://fivethirtyeight.com/tag/mlb/feed/"},
			{NewsFeeds.mlb, "http://mlb.mlb.com/partnerxml/gen/news/rss/mlb.xml"},
			{NewsFeeds.si, "https://www.si.com/rss/si_mlb.rss"}
		};

		public NewsModel(IEnumerable<string> feedNames)
		{
			var feeds = new List<NewsFeeds>();

			foreach (var name in feedNames)
			{
				NewsFeeds feed;
				if (Enum.TryParse(name, out feed))
				{
					feeds.Add(feed);
				}
			}

			this.Feeds = feeds;
		}

		public void PopulateModel()
		{
			var feedCreator = new NewsFeedCreator();
			var allFeedItems = new List<RssItem>();
			foreach (var feed in this.Feeds)
			{
				if (FeedUrls.ContainsKey(feed))
				{
					var url = FeedUrls[feed];

					var rss = feedCreator.GetFeed(url);
					foreach (var item in rss.RssChannel.RssItems)
					{
						item.NewsFeed = feed.ToString();
					}
					allFeedItems.AddRange(rss.RssChannel.RssItems);
				}
			}

			this.Item = allFeedItems.OrderByDescending(a => a.PubDate);
		}
	}
}