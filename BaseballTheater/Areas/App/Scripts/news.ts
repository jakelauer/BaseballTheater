namespace Theater
{
	import NewsFeedCreator = MlbDataServer.NewsFeedCreator;

	export class News extends Site.Page
	{
		public static Instance = new News();

		public initialize()
		{
			Site.startLoading();

			this.getData();
		}

		public dataBind()
		{
			
		}

		public renew(pathname: string)
		{
			this.initialize();
		}

		private async getData()
		{
			try
			{
				MlbDataServer.NewsFeedCreator.getFeed().then(result =>
				{
					console.log(result);

					const all = result.sort((a, b) => {
						return a.pubDateObj.isAfter(b.pubDateObj) ? -1 : 1;
					});

					App.Instance.newsVueData.rssItems = all;
					Site.stopLoading();
				});
			}
			catch (e)
			{
				console.error(e);
			}
		}

		public destroy()
		{
			App.Instance.newsVueData.rssItems = [];
		}
	}

	Site.addPage({
		page: News.Instance,
		matchingUrl: /^\/news/,
		name: "news"
	});
}