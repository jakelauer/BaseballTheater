using BaseballTheater.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using MlbDataEngine.Contracts.News;
using MlbDataEngine.Engine;

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
			{NewsFeeds.mtr, "https://www.mlbtraderumors.com/feed"},
			{NewsFeeds.reddit, "https://www.reddit.com/r/baseball/.rss"}
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


		private static readonly Dictionary<string, string> RedditMap = new Dictionary<string, string>
		{
			{"ari", "azdiamondbacks"},
			{"atl", "braves"},
			{"bal", "orioles"},
			{"bos", "redsox"},
			{"chc", "chicubs"},
			{"cws", "whitesox"},
			{"cin", "reds"},
			{"cle", "wahoostipi"},
			{"col", "coloradorockies"},
			{"det", "motorcitykitties"},
			{"mia", "letsgofish"},
			{"hou", "astros"},
			{"kc", "kcroyals"},
			{"ana", "angelsbaseball"},
			{"la", "angelsbaseball"},
			{"mil", "brewers"},
			{"min", "minnesotatwins"},
			{"nym", "newyorkmets"},
			{"nyy", "nyyankees"},
			{"oak", "oaklandathletics"},
			{"phi", "phillies"},
			{"pit", "buccos"},
			{"sd", "padres"},
			{"sf", "sfgiants"},
			{"sea", "mariners"},
			{"stl", "cardinals"},
			{"tb", "tampabayrays"},
			{"tex", "texasrangers"},
			{"tor", "torontobluejays"},
			{"was", "nationals"},
		};

		public NewsModel(IEnumerable<string> feedNames, string favTeam)
		{
			var feeds = new List<NewsFeeds>();
			var feedUrlsExtra = new List<Tuple<NewsFeeds, string>>();

			foreach (var name in feedNames.Distinct())
			{
				NewsFeeds feed;
				if (Enum.TryParse(name, out feed))
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
					else if (name == "reddit_fav_team")
					{
						var teamName = RedditMap.TryGetValueOrDefault(favTeam);
						feedUrlsExtra.Add(new Tuple<NewsFeeds, string>(NewsFeeds.reddit, $"https://www.reddit.com/r/{teamName}/.rss"));
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
				var rss = feed == NewsFeeds.reddit
					? feedCreator.GetAtomFeed(FeedUrls[feed])
					: feedCreator.GetFeed(FeedUrls[feed]);

				if (rss.RssChannel.RssItems != null)
				{
					foreach (var item in rss.RssChannel.RssItems)
					{
						item.NewsFeed = feed.ToString();
					}
					allFeedItems.AddRange(rss.RssChannel.RssItems);
				}
			}

			foreach (var feedUrlTuple in this.FeedUrlsExtra)
			{
				var rss = feedUrlTuple.Item1 == NewsFeeds.reddit
					? feedCreator.GetAtomFeed(feedUrlTuple.Item2)
					: feedCreator.GetFeed(feedUrlTuple.Item2);

				foreach (var item in rss.RssChannel.RssItems)
				{
					item.NewsFeed = feedUrlTuple.Item1.ToString();
				}
				allFeedItems.AddRange(rss.RssChannel.RssItems);
			}

			this.Item = allFeedItems
				.GroupBy(a => a.Link)
				.Select(a => a.First())
				.Where(a => a.PubDate != null)
				.Where(a =>
				{
					var diff = DateTime.UtcNow - a.PubDate.Value;
					var withinWeek = diff.TotalDays <= 7;

					return withinWeek;
				})
				.OrderByDescending(a => a.PubDate)
				.Take(50);
		}
	}
}