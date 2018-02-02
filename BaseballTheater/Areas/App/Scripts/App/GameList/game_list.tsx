namespace Theater
{
	interface IGameListState
	{
		gameSummaries: GameSummaryData[];
		date: moment.Moment;
	}

	class GameList extends React.Component<any, IGameListState>
	{
		private pikaday: any;

		constructor(props: any)
		{
			super(props);

			const date = this.getDateFromPath(location.pathname);

			this.state = {
				gameSummaries: [],
				date,
			};
		}

		public OnLocationTrigger()
		{
			this.setState({
				date: this.getDateFromPath(location.pathname)
			});
		}

		private getDateFromPath(pathname: string)
		{
			let dateString: string = "";
			if (pathname.length > 1)
			{
				const pathnameNumbers = pathname.replace(/[^0-9]+/, "");
				dateString = pathnameNumbers;
			}

			if (dateString.trim().length === 0)
			{
				dateString = this.getDefaultDate().format("YYYYMMDD");
			}

			const date = moment(dateString, "YYYYMMDD");

			return date;
		}

		private updateDate = (newDate: moment.Moment) =>
		{
			this.setState({
				date: newDate
			}, () => this.loadGamesForCurrentDate());
		}

		private getDefaultDate()
		{
			const lastEndingDay = "20171101";
			const nextOpeningDay = "20180223";

			const openingDay2017 = moment(nextOpeningDay, "YYYYMMDD");
			const today = moment();

			const date = today.isAfter(openingDay2017)
				? today
				: moment(lastEndingDay, "YYYYMMDD");

			return date;
		}

		private getInningCount(linescore: Linescore)
		{
			if (linescore && linescore.inning_line_score)
			{
				return linescore.inning_line_score.length;
			}

			return 0;
		}

		public componentDidMount()
		{
			this.loadGamesForCurrentDate();
		}

		private loadGamesForCurrentDate()
		{
			App.startLoading();
			const summaries = MlbDataServer.GameSummaryCreator.getSummaryCollection(this.state.date);
			const favoriteTeam = Cookies.get("favoriteteam");

			summaries.then((gameSummaryCollection) =>
			{
				if (gameSummaryCollection && gameSummaryCollection.games)
				{
					const games = gameSummaryCollection.games.game;
					this.sortGames(games, favoriteTeam);

					this.setState({
						gameSummaries: games,
					});

					App.stopLoading();
				}
			});
		}

		private sortGames(games: GameSummaryData[], favoriteTeam: string)
		{
			games.sort((a, b) =>
			{
				var aIsFavorite = (a.home_file_code === favoriteTeam || a.away_file_code === favoriteTeam) ? -1 : 0;
				var bIsFavorite = (b.home_file_code === favoriteTeam || b.away_file_code === favoriteTeam) ? -1 : 0;
				var favoriteReturn = aIsFavorite - bIsFavorite;

				var startTimeReturn = a.dateObjLocal.isBefore(b.dateObjLocal) ? -1 : 1;

				return favoriteReturn || startTimeReturn;
			});
		}

		public render(): React.ReactNode
		{
			const games = this.state.gameSummaries.map((gameSummary, i) =>
			{
				return <GameSummary game={gameSummary} key={i}/>;
			});

			return (
				<div className={`game-list-container`}>
					<div className={`settings`}>
						<Calendar initialDate={this.state.date} onDateChange={this.updateDate}/>
					</div>
					<div className={`game-list`}>
						{games}
					</div>
				</div>
			);
		}
	}

	App.addPage({
		matchingUrl:
			/^\/?([0-9]{8})?(\?.*)?$/i, //match URLs of nothing, or just a /, or a / then 8 digits and an optional querystring
		page: <GameList />,
		name: "games"
	});
}