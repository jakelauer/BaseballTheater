using BaseballTheater.Extensions;
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
		private IEnumerable<Tuple<NewsFeeds, string>> FeedUrlsExtra { get; }

		public IEnumerable<RssItem> Item { get; set; }

		private static readonly Dictionary<NewsFeeds, string> FeedUrls = new Dictionary<NewsFeeds, string>
		{
			{NewsFeeds.espn, "http://www.espn.com/espn/rss/mlb/news"},
			{NewsFeeds.fangraphs, "http://www.fangraphs.com/blogs/feed/"},
			{NewsFeeds.fivethirtyeight, "https://fivethirtyeight.com/tag/mlb/feed/"},
			{NewsFeeds.mlb, "http://mlb.mlb.com/partnerxml/gen/news/rss/mlb.xml"},
			{NewsFeeds.mtr, "https://www.mlbtraderumors.com/feed"}
		};

		private static readonly Dictionary<string, string> MtrMap = new Dictionary<string, string>
		{
			{"ari", "arizona-diamondbacks"},
			{"atl", "atlanta-braves"},
			{"bal", "baltimore-orioles"},
			{"bos", "boston-red-sox"},
			{"chc", "chicago-cubs"},
			{"cws", "chicago-white-sox"},
			{"cin", "cincinnati-reds"},
			{"cle", "cleveland-indians"},
			{"col", "colorado-rockies"},
			{"det", "detroit-tigers"},
			{"mia", "miami-marlins"},
			{"hou", "houston-astros"},
			{"kc", "kansas-city-royals"},
			{"ana", "los-angeles-angels"},
			{"la", "los-angeles-angels"},
			{"mil", "milwaukee-brewers"},
			{"min", "minnesota-twins"},
			{"nym", "new-york-mets"},
			{"nyy", "new-york-yankees"},
			{"oak", "oakland-athletics"},
			{"phi", "philadelphia-phillies"},
			{"pit", "pittsburgh-pirates"},
			{"sd", "san-diego-padres"},
			{"sf", "san-francisco-giants"},
			{"sea", "seattle-mariners"},
			{"stl", "st-louis-cardinals"},
			{"tb", "tampa-bay-rays"},
			{"tex", "texas-rangers"},
			{"tor", "toronto-blue-jays"},
			{"was", "washington-nationals"}
		};

		public NewsModel(IEnumerable<string> feedNames, string favTeam)
		{
			var feeds = new List<NewsFeeds>();
			var feedUrlsExtra = new List<Tuple<NewsFeeds, string>>();

			foreach (var name in feedNames)
			{
				if (Enum.TryParse(name, out NewsFeeds feed))
				{
					feeds.Add(feed);
				}
				else if (!string.IsNullOrEmpty(favTeam) && favTeam != "0")
				{
					if (name == "mlb_fav_team")
					{
						feedUrlsExtra.Add(new Tuple<NewsFeeds, string>(NewsFeeds.mlb,
							$"http://mlb.mlb.com/partnerxml/gen/news/rss/{favTeam}.xml"));
					}
					else if (name == "mtr_fav_team")
					{
						var teamName = MtrMap.TryGetValueOrDefault(favTeam);
						feedUrlsExtra.Add(new Tuple<NewsFeeds, string>(NewsFeeds.mtr, $"https://www.mlbtraderumors.com/{teamName}/feed"));
					}
				}
			}

			this.Feeds = feeds;
			this.FeedUrlsExtra = feedUrlsExtra;
		}

		public void PopulateModel()
		{
			var feedCreator = new NewsFeedCreator();
			var allFeedItems = new List<RssItem>();
			foreach (var feed in this.Feeds)
			{
				var rss = feedCreator.GetFeed(FeedUrls[feed]);
				foreach (var item in rss.RssChannel.RssItems)
				{
					item.NewsFeed = feed.ToString();
				}
				allFeedItems.AddRange(rss.RssChannel.RssItems);
			}

			foreach (var feedUrlTuple in this.FeedUrlsExtra)
			{
				var rss = feedCreator.GetFeed(feedUrlTuple.Item2);
				foreach (var item in rss.RssChannel.RssItems)
				{
					item.NewsFeed = feedUrlTuple.Item1.ToString();
				}
				allFeedItems.AddRange(rss.RssChannel.RssItems);
			}

			this.Item = allFeedItems.OrderByDescending(a => a.PubDate);
		}
	}
}