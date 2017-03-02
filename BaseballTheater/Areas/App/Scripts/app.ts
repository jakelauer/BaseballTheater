namespace Theater
{
	export var startTime: moment.Moment;
	export var endTime: moment.Moment;

	export enum NetSpeed
	{
		Slow,
		Medium,
		Fast
	}

	interface IGameListVueData
	{
		gameSummaries: GameSummary[];
	}

	interface ISettingsVueData
	{
		teams: { [filecode: string]: string };
		showingGameList: boolean;
		hideScores: boolean;
		favoriteTeam: string;
		date: moment.Moment;
	}

	interface Backer
	{
		name: string;
		level: number;
	}
	interface IBackersVueData
	{
		backers: Backer[];
	}

	export class App extends Site.Page
	{
		public static Instance = new App();

		public gameListVue: vuejs.Vue;
		public settingsVue: vuejs.Vue;
		private highlightsVue: vuejs.Vue;
		private backersVue: vuejs.Vue;

		public static get clientNetSpeed()
		{
			if (endTime)
			{
				const diff = endTime.diff(startTime);

				if (diff > 2000)
				{
					return NetSpeed.Slow;
				}
				else if (diff > 1000)
				{
					return NetSpeed.Medium;
				}
			}

			return NetSpeed.Fast;
		}

		public gameListVueData: IGameListVueData = {
			gameSummaries: []
		};

		public settingsVueData: ISettingsVueData = {
			teams: MlbDataServer.Teams.TeamList,
			showingGameList: true,
			favoriteTeam: Cookies.get("favoriteteam"),
			hideScores: Cookies.get("hideScores") === "true",
			date: moment()
		};

		public highlightsVueData: IHighlightsVueData = {
			highlights: [],
			gameSummary: null
		}

		public backersVueData: IBackersVueData = {
			backers: []
		};

		public initialize()
		{
			App.Instance.settingsVueData.showingGameList = false;

			$(".menu-trigger, .side-menu a").on("click", () =>
			{
				$("html").toggleClass("side-menu-open");
			});

			$(document).on("click", (e) =>
			{
				var $el = $(e.target);
				if ($el.closest(".side-menu").length === 0 && $el.closest(".menu-trigger").length === 0 && $("html").hasClass("side-menu-open"))
				{
					$("html").removeClass("side-menu-open");
				}
			});

			this.gameListVue = new Vue({
				el: ".game-list",
				data: this.gameListVueData,
				methods: {
					showNoGames: () =>
					{
						return Site.currentPage.page === GameList.Instance;
					}
				}
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
					},
					onChangeHideScores: (event: Event) =>
					{
						var el = event.currentTarget as HTMLInputElement;
						var hideScores = el.checked;
						this.settingsVueData.hideScores = hideScores;
						Cookies.set("hideScores", hideScores, { expires: 999 });

					}
				},
				watch: {
					date: (moment: moment.Moment) =>
					{
						document.title = App.getTitle(`Game Highlights for ${moment.format("MMMM Do YYYY")}`);
					}
				}
			});

			this.highlightsVue = new Vue({
				el: ".highlights",
				data: this.highlightsVueData,
				methods: {
					showNoHighlights: () =>
					{
						return Site.currentPage.page === GameDetail.Instance;
					}
				},
				watch: {
					gameSummary: (gameSummary: GameSummary) =>
					{
						if (!gameSummary)
						{
							return;
						}

						var awayTeam = gameSummary.away_team_name;
						var homeTeam = gameSummary.home_team_name;
						var time = gameSummary.dateObj.format("MMMM Do YYYY");
						document.title = App.getTitle(`${awayTeam} @ ${homeTeam} - ${time}`);
					}
				}
			});

			this.backersVue = new Vue({
				el: ".backers",
				data: this.backersVueData
			});
		}

		public dataBind()
		{
			
		}

		public renew(pathname: string)
		{
		}

		public static getTitle(title: string)
		{
			return `${title} - Baseball Theater`;
		}

		public destroy() {}

	}

	Site.addPage({
		matchingUrl: /.*/,
		page: App.Instance
	});
}