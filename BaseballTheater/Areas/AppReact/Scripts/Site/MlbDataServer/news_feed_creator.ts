namespace Theater.MlbDataServer
{
	export class NewsFeedCreator
	{
		private static FangraphsUrl: string = "http://www.fangraphs.com/blogs/feed/";
		private static SiUrl: string = "https://www.si.com/rss/si_mlb.rss";
		private static Five38Url: string = "https://fivethirtyeight.com/tag/mlb/feed/";
		private static EspnUrl: string = "http://www.espn.com/espn/rss/mlb/news";

		public static async getFeed(): Promise<IRssItem[]>
		{
			const fgFeed = await Utils.XmlLoader.load<IRssFeed>(NewsFeedCreator.FangraphsUrl, "FangraphsUrl");
			const SiFeed = await Utils.XmlLoader.load<IRssFeed>(NewsFeedCreator.SiUrl, "SiUrl");
			const five38Feed = await Utils.XmlLoader.load<IRssFeed>(NewsFeedCreator.Five38Url, "Five38Url");
			const espnUrlFeed = await Utils.XmlLoader.load<IRssFeed>(NewsFeedCreator.EspnUrl, "EspnUrl");

			const fgFeedFixed = new RssFeed(fgFeed);
			const SiFeedFixed = new RssFeed(SiFeed);
			const five38FeedFixed = new RssFeed(five38Feed);
			const espnUrlFeedFixed = new RssFeed(espnUrlFeed);

			let all = [];

			if (fgFeedFixed.rss.channel)
			{
				all = [...all, ...fgFeedFixed.rss.channel.item];
			}

			if (five38FeedFixed.rss.channel)
			{
				all = [...all, ...five38FeedFixed.rss.channel.item];
			}

			if (SiFeedFixed.rss.channel)
			{
				all = [...all, ...SiFeedFixed.rss.channel.item];
			}

			if (espnUrlFeedFixed.rss.channel)
			{
				all = [...all, ...espnUrlFeedFixed.rss.channel.item];
			}

			return all;
		}
	}
}