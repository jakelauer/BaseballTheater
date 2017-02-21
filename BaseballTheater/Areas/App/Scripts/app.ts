namespace Theater
{
	interface IGameListVueData
	{
		gameSummaries: GameSummary[];
	}

	interface ISettingsVueData
	{
		teams: { [filecode: string]: string };
		showingGameList: boolean;
		favoriteTeam: string;
		date: moment.Moment;
	}

	export class App extends Site.Page
	{
		public gameListVue: vuejs.Vue;
		public settingsVue: vuejs.Vue;
		private highlightsVue: vuejs.Vue;

		public gameListVueData: IGameListVueData = {
			gameSummaries: []
		};

		public settingsVueData: ISettingsVueData = {
			teams: MlbDataServer.Teams.TeamList,
			showingGameList: true,
			favoriteTeam: Cookies.get("favoriteteam"),
			date: moment()
		};

		public highlightsVueData: IHighlightsVueData = {
			highlights: []
		}

		public initialize()
		{
			this.gameListVue = new Vue({
				el: ".game-list",
				data: this.gameListVueData
			});

			this.settingsVue = new Vue({
				el: ".settings",
				data: this.settingsVueData,
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
					},
					setFavoriteTeam: (event: Event) =>
					{
						var selectEl = event.currentTarget as HTMLSelectElement;
						Cookies.set("favoriteteam", selectEl.value, { expires: 999 });
						this.settingsVueData.favoriteTeam = selectEl.value;

						this.settingsVue.$emit("favoriteTeamSet", selectEl.value);
					},
					isFavoriteTeam: (teamCode: string) =>
					{
						return teamCode === this.settingsVueData.favoriteTeam;
					}
				}
			});

			this.highlightsVue = new Vue({
				el: ".highlights",
				data: this.highlightsVueData,
				methods: {
				}
			});
		}

		public dataBind() {}

		public renew(pathname: string)
		{
		}

		public destroy() {}

		public static Instance = new App();
	}

	Site.addPage({
		matchingUrl: /.*/,
		page: App.Instance
	});
}