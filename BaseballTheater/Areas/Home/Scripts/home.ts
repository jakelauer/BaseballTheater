namespace Theater
{
	interface IHomeVueData
	{
		gameSummaries: GameSummary[];
	}

	interface ISettingsVueData
	{
		teams: { [filecode: string]: string };
		date: moment.Moment;
	}

	export class Home extends Site.Page
	{
		public static Instance = new Home();

		private gameListVue: vuejs.Vue;
		private settingsVue: vuejs.Vue;
		private dateString: string = null;

		private homeVueData: IHomeVueData = {
			gameSummaries: []
		};

		private settingsData: ISettingsVueData = {
			teams: MlbDataServer.Teams.TeamList,
			date: moment()
		};

		public initialize()
		{
			if (this.dateString === null)
			{
				this.dateString = this.getDateFromPath(location.pathname);
			}

			var requestedDay = moment(this.dateString, "YYYYMMDD");

			this.getGameSummariesForDate(requestedDay);

			this.settingsData.date = requestedDay;
		}

		private getGameSummariesForDate(date: moment.Moment)
		{
			Site.startLoading();

			var summaries = MlbDataServer.GameSummaryCreator.getSummaryCollection(date);

			summaries.then((result) =>
			{
				console.log(result);
				var gameSummaryCollection = new GameSummaryCollection(result);
				this.homeVueData.gameSummaries = gameSummaryCollection.games.games;
				console.log(this.homeVueData);

				Site.stopLoading();
			});
		}

		public dataBind()
		{
			this.gameListVue = new Vue({
				el: ".game-list",
				data: this.homeVueData
			});

			this.settingsVue = new Vue({
				el: ".settings",
				data: this.settingsData,
				methods: {
					getUrlDayBefore: (date: moment.Moment) =>
					{
						var newDate = moment(date);
						return `/${newDate.add("d", -1).format("YYYYMMDD")}`;
					},
					getUrlDayAfter: (date: moment.Moment) =>
					{
						var newDate = moment(date);
						return `/${newDate.add("d", 1).format("YYYYMMDD")}`;
					},
					getFriendlyDate: (date: moment.Moment) =>
					{
						var newDate = moment(date);
						return newDate.format("MMM DD, YYYY");
					}
				}
			});
		}

		public renew(pathname: string)
		{
			let dateString = this.getDateFromPath(pathname);

			this.dateString = dateString;

			this.initialize();
		}

		public destroy()
		{
			this.homeVueData.gameSummaries = [];
		}

		private getDefaultDate()
		{
			var endingDay2016String = "20161102";
			var openingDay2017String = "20170402";

			var openingDay2017 = moment(openingDay2017String, "YYYYMMDD");
			var today = moment();

			let date = today >= openingDay2017
				? today
				: moment(endingDay2016String, "YYYYMMDD");

			return date;
		}

		private getDateFromPath(pathname: string)
		{
			let dateString: string;
			if (pathname.length > 1)
			{
				let pathnameNumbers = pathname.replace(/[^0-9]/, "");
				dateString = pathnameNumbers;
			}
			else
			{
				dateString = this.getDefaultDate().format("YYYYMMDD");
			}

			return dateString;
		}
	}

	Site.addPage({
		bodySelector: "body.Home",
		matchingUrl: /^\/?([0-9]{8})?(\?.*)?$/i, //match URLs of nothing, or just a /, or a / then 8 digits and an optional querystring
		page: Home.Instance
	});
}