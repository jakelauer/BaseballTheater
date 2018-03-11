namespace Theater
{
	import IPageProps = Theater.IPageProps;
	import ISettings = Theater.ISettings;

	interface IGameListState
	{
		gameSummaries: GameSummaryData[];
		date: moment.Moment;
	}
	
	interface IGameListProps extends IPageProps
	{
		settings: ISettings;
	}

	class GameList extends React.Component<IGameListProps, IGameListState>
	{
		private pikaday: any;

		constructor(props: IGameListProps)
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
				dateString = pathname.replace(/[^0-9]+/, "");
			}

			if (dateString.trim().length === 0)
			{
				dateString = this.getDefaultDate().format("YYYYMMDD");
			}

			return moment(dateString, "YYYYMMDD");
		}

		private updateDate = (newDate: moment.Moment) =>
		{
			this.setState({
				date: newDate
			}, () => this.loadGamesForCurrentDate());
		};

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

		public componentDidMount()
		{
			this.loadGamesForCurrentDate();
		}

		private loadGamesForCurrentDate()
		{
			App.startLoading();
			const summaries = MlbDataServer.GameSummaryCreator.getSummaryCollection(this.state.date);

			summaries.then((gameSummaryCollection) =>
			{
				if (gameSummaryCollection && gameSummaryCollection.games)
				{
					const games = gameSummaryCollection.games.game;

					this.setState({
						gameSummaries: games,
					});

					App.stopLoading();
				}
			});
		}

		private sortGames(games: GameSummaryData[])
		{
			const favoriteTeam = this.props.settings.favoriteTeam;
			games.sort((a, b) =>
			{
				const aIsFavorite = (a.home_file_code === favoriteTeam || a.away_file_code === favoriteTeam) ? -1 : 0;
				const bIsFavorite = (b.home_file_code === favoriteTeam || b.away_file_code === favoriteTeam) ? -1 : 0;
				const favoriteReturn = aIsFavorite - bIsFavorite;

				const startTimeReturn = a.dateObjLocal.isBefore(b.dateObjLocal) ? -1 : 1;

				const finalReturn = a.isFinal ? 1 : -1;

				return favoriteReturn || finalReturn || startTimeReturn;
			});
		}

		public render()
		{
			const gamesInProgress = this.state.gameSummaries.filter(a => !a.isFinal);
			const gamesFinal = this.state.gameSummaries.filter(a => a.isFinal);
			
			this.sortGames(gamesInProgress);
			this.sortGames(gamesFinal);

			const gamesInProgressRendered = gamesInProgress.map((gameSummary, i) =>
			{
				return <GameSummary game={gameSummary} key={i} hideScores={this.props.settings.hideScores}/>;
			});

			const finalGamesRendered = gamesFinal.map((gameSummary, i) =>
			{
				const key = gamesInProgress.length + i;
				return <GameSummary game={gameSummary} key={key} hideScores={this.props.settings.hideScores}/>;
			});

			const noGames = this.state.gameSummaries.length === 0
				? <div className={`no-data`}>No games found for this date.</div>
				: null;

			const someFinalSomeNot = gamesInProgress.length > 0 && gamesFinal.length > 0;

			return (
				<div className={`game-list-container`}>
					<div className={`settings`}>
						<Calendar initialDate={this.state.date} onDateChange={this.updateDate}/>
					</div>

					<div className={`game-list`}>
						{gamesInProgressRendered}
					</div>

					{someFinalSomeNot &&
					<h2>Final</h2>
					}
					<div className={`game-list`}>
						{finalGamesRendered}
					</div>

					{noGames}
				</div>
			);
		}
	}

	App.Instance.addPage({
		matchingUrl:
			/^\/?([0-9]{8})?(\?.*)?$/i, //match URLs of nothing, or just a /, or a / then 8 digits and an optional querystring
		page: props => <GameList settings={props.settings} />,
		name: "games"
	});
}