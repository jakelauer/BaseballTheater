namespace Theater
{
	export class Backers extends Site.Page
	{
		public static Instance = new Backers();

		public initialize()
		{
			App.Instance.backersVueData.showBackers = true;
			App.Instance.backersVueData.backers = BackersList.Backers;
			App.Instance.backersVueData.teamSponsors = BackersList.TeamSponsors;
			App.Instance.backersVueData.premiumSponsors = BackersList.PremiumSponsors;
		}

		public dataBind()
		{
		}

		public renew(pathname: string)
		{
			this.initialize();
		}

		public destroy()
		{
			App.Instance.backersVueData.backers = [];
			App.Instance.backersVueData.teamSponsors = [];
			App.Instance.backersVueData.premiumSponsors = [];
			App.Instance.backersVueData.showBackers = false;
		}
	}

	Site.addPage({
		matchingUrl: /^\/backers(.*)/,
		page: Backers.Instance
	});
}