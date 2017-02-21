namespace Theater
{
	export class GameList extends Site.Page
	{
		public static Instance = new GameList();

		private dateString: string = null;
		private pikaday: any;

		public initialize()
		{
			if (this.dateString === null)
			{
				this.dateString = this.getDateFromPath(location.pathname);
			}

			const requestedDay = moment(this.dateString, "YYYYMMDD");

			this.getGameSummariesForDate(requestedDay);

			App.Instance.settingsVueData.date = requestedDay;
			App.Instance.settingsVueData.showingGameList = true;
		}

		private getGameSummariesForDate(date: moment.Moment)
		{
			Site.startLoading();

			const summaries = MlbDataServer.GameSummaryCreator.getSummaryCollection(date);

			const favoriteTeam = Cookies.get("favoriteteam");;

			summaries.then((result) =>
			{
				var gameSummaryCollection = new GameSummaryCollection(result);
				var games = gameSummaryCollection.games.games;
				this.sortGames(games, favoriteTeam);
				App.Instance.gameListVueData.gameSummaries = gameSummaryCollection.games.games;

				Site.stopLoading();

				this.initCalendar();
			});
		}

		private sortGames(games: GameSummary[], favoriteTeam: string)
		{
			games.sort((a, b) => {
				var aIsFavorite = a.home_file_code === favoriteTeam || a.away_file_code === favoriteTeam;

				return aIsFavorite ? -1 : 1;
			});
		}

		public dataBind()
		{
			App.Instance.settingsVue.$on("favoriteTeamSet", (favoriteTeam: string) =>
			{
				var games = App.Instance.gameListVueData.gameSummaries;
				this.sortGames(games, favoriteTeam);
			});
		}

		public renew(pathname: string)
		{
			const dateString = this.getDateFromPath(pathname);

			this.dateString = dateString;

			this.pikaday.destroy();
			this.initialize();
		}

		public destroy()
		{
			App.Instance.gameListVueData.gameSummaries = [];
			App.Instance.settingsVueData.showingGameList = false;
			this.pikaday.destroy();
		}

		private initCalendar()
		{
			this.pikaday = new Pikaday({
				field: $("#calendarpicker")[0],
				format: "MMM DD, YYYY",
				onSelect: (date) =>
				{
					var dateText = moment(date).format("YYYYMMDD");
					var href = `/${dateText}`;
					Site.LinkHandler.pushState(href);
				}
			});

			$(".fa-calendar").on("click",
				() =>
				{
					this.pikaday.show();
				});
		}

		private getDefaultDate()
		{
			const endingDay2016String = "20161102";
			const openingDay2017String = "20170402";

			const openingDay2017 = moment(openingDay2017String, "YYYYMMDD");
			const today = moment();

			const date = today >= openingDay2017
				? today
				: moment(endingDay2016String, "YYYYMMDD");

			return date;
		}

		private getDateFromPath(pathname: string)
		{
			let dateString: string;
			if (pathname.length > 1)
			{
				const pathnameNumbers = pathname.replace(/[^0-9]/, "");
				dateString = pathnameNumbers;
			} else
			{
				dateString = this.getDefaultDate().format("YYYYMMDD");
			}

			return dateString;
		}
	}

	Site.addPage({
		matchingUrl:
			/^\/?([0-9]{8})?(\?.*)?$/i, //match URLs of nothing, or just a /, or a / then 8 digits and an optional querystring
		page: GameList.Instance
	});
}