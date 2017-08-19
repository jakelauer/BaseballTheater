namespace Theater.MlbDataServer
{
	export class NewsFeedCreator
	{
		private static FangraphsUrl: string = "http://www.fangraphs.com/blogs/feed/";
		private static MlbTradeRumorsUrl: string = "https://www.mlbtraderumors.com/feed";
		private static Five38Url: string = "https://fivethirtyeight.com/tag/mlb/feed/";

		public static async getFeed(): Promise<IRssItem[]>
		{
			const fgFeed = await Utils.XmlLoader.load<IRssFeed>(NewsFeedCreator.FangraphsUrl, "FangraphsUrl");
			const mtrFeed = await Utils.XmlLoader.load<IRssFeed>(NewsFeedCreator.MlbTradeRumorsUrl, "MlbTradeRumorsUrl");
			const five38Feed = await Utils.XmlLoader.load<IRssFeed>(NewsFeedCreator.Five38Url, "Five38Url");

			const fgFeedFixed = new RssFeed(fgFeed);
			const mtrFeedFixed = new RssFeed(mtrFeed);
			const five38FeedFixed = new RssFeed(five38Feed);

			let all = [];

			if (fgFeedFixed.rss.channel)
			{
				all = [...all, ...fgFeedFixed.rss.channel.item];
			}

			if (mtrFeedFixed.rss.channel) {
				all = [...all, ...mtrFeedFixed.rss.channel.item];
			}

			if (five38FeedFixed.rss.channel) {
				all = [...all, ...five38FeedFixed.rss.channel.item];
			}

			return all;
		}
	}
}