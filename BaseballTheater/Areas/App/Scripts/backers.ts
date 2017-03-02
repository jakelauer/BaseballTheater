namespace Theater
{
	export class Backers extends Site.Page
	{
		public static Instance = new Backers();

		public initialize()
		{
			App.Instance.backersVueData.backers = [
				{
					name: "Brian Stoops",
					level: 2
				}
			];
		}

		public dataBind()
		{
		}

		public renew(pathname: string)
		{
		}

		public destroy()
		{
			App.Instance.backersVueData.backers = [];
		}
	}

	Site.addPage({
		matchingUrl: /^\/backers(.*)/,
		page: Backers.Instance
	});
}