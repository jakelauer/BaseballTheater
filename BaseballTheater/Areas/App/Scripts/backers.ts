namespace Theater
{
	export class BackersPage extends Site.Page
	{
		public static Instance = new BackersPage();

		public async initialize()
		{
			App.Instance.backersVueData.showBackers = true;

			var backers = await BackersList.Instance.getBackers();

			App.Instance.backersVueData.teamSponsors = backers.TeamSponsors || [];
			App.Instance.backersVueData.premiumSponsors = backers.PremiumSponsors || [];
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
			App.Instance.backersVueData.teamSponsors = [];
			App.Instance.backersVueData.premiumSponsors = [];
			App.Instance.backersVueData.showBackers = false;
		}
	}

	Site.addPage({
		matchingUrl: /^\/backers(.*)/,
		page: BackersPage.Instance
	});
}