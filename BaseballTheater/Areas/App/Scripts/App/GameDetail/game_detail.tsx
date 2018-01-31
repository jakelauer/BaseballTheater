namespace Theater.GameDetail
{
	enum Tabs
	{
		PlayByPlay,
		BoxScore
	}

	interface IGameDetailState
	{
		gameSummary: GameSummaryData;
		boxScore: BoxScoreData;
		highlightsCollection: IHighlightsCollection,
		currentTab: Tabs;
	}

	export class GameDetail extends React.Component<any, IGameDetailState>
	{
		private date: moment.Moment = null;
		private gamePk: string;

		constructor(props: any)
		{
			super(props);

			this.date = this.getDateFromPath(location.pathname);
			this.gamePk = this.getGamePkFromPath(location.pathname);

			this.state = {
				boxScore: null,
				highlightsCollection: null,
				gameSummary: null,
				currentTab: Tabs.PlayByPlay
			}
		}

		public componentDidMount()
		{
			this.getData();
		}

		private showNoHighlights()
		{
			return true;
		}

		private getTeamSponsors(fileCode: string)
		{
			return 0;
		}

		private async getHighlights(currentGame: GameSummaryData): Promise<IHighlightsCollection>
		{
			if (currentGame !== null)
			{
				const gameDetailCreator = new MlbDataServer.GameDetailCreator(currentGame.game_data_directory, false);
				const highlights = await gameDetailCreator.getHighlights();
				return highlights;
			}

			return null;
		}

		private async getBoxScore(currentGame: GameSummaryData): Promise<BoxScoreData>
		{
			if (currentGame !== null)
			{
				const gameDetailCreator = new MlbDataServer.GameDetailCreator(currentGame.game_data_directory, false);
				const boxScore = await gameDetailCreator.getBoxscore();
				return boxScore;
			}

			return null;
		}

		private getDateFromPath(pathname: string)
		{
			const pathnameDateString = pathname.split("/")[2].replace(/[^0-9]/, "");
			const date = moment(pathnameDateString, "YYYYMMDD");
			return date;
		}

		private getGamePkFromPath(pathname: string)
		{
			const pathnamePk = pathname.split("/")[3].replace(/[^0-9]/, "");
			return pathnamePk;
		}

		private setTabState(currentTab: Tabs)
		{
			this.setState({
				currentTab
			});
		}

		private getCurrentGame(): Promise<GameSummaryData>
		{

			return new Promise((resolve, reject) =>
			{
				const summaries = MlbDataServer.GameSummaryCreator.getSummaryCollection(this.date);

				summaries.then((gameSummaryCollection) =>
				{
					if (gameSummaryCollection.games && gameSummaryCollection.games.game)
					{
						const gameList = gameSummaryCollection.games.game;
						for (var game of gameList)
						{
							if (game.game_pk === this.gamePk)
							{
								resolve(game);
							}
						}

						reject(`No game found matching game_pk of ${this.gamePk}`);
					}
				});
			});
		}

		private async getData()
		{
			App.startLoading();

			try
			{
				const gameSummary = await this.getCurrentGame();
				const boxScore = await this.getBoxScore(gameSummary);

				const highlightsCollection = await this.getHighlights(gameSummary);

				this.setState({
					gameSummary,
					boxScore,
					highlightsCollection
				});

				App.stopLoading();
			}
			catch (e)
			{
				console.log(e);

				App.stopLoading();
			}
		}

		public render()
		{
			const gameSummary = this.state.gameSummary;
			if (!gameSummary)
			{
				return (<div/>);
			}

			const boxScoreData = this.state.boxScore;
			const highlightsCollection = this.state.highlightsCollection;

			return (
				<div className={`game-detail-container`}>
					<div className={`game-data-tab-container`}>
						<div className={`tabs`}>
							<div className={`tab`} onClick={_ => this.setTabState(Tabs.PlayByPlay)}>
								Play by Play
							</div>
							<div className={`tab`} onClick={_ => this.setTabState(Tabs.BoxScore)}>
								Box Score
							</div>
						</div>
						<div className={`tab-contents`}>
							<div className={`tab-content`} data-tab={Tabs.PlayByPlay}>
								<PlayByPlay />
							</div>
							<div className={`tab-content`} data-tab={Tabs.BoxScore}>
								<BoxScore boxScoreData={boxScoreData} />
							</div>
						</div>
					</div>

					<div className={`game-detail-wrapper`}>
						<div className={`highlights-wrapper on`}>
							{<Highlights highlightsCollection={highlightsCollection} />}

							{this.showNoHighlights() &&
								<div className={`empty`}>
									No highlights found for this game. Highlights for some games may not be published until the game is complete.
								</div>
							}
						</div>
					</div>
				</div>
			);
		}

		private renderTeam(teamType: HomeAway)
		{
			const gameSummary = this.state.gameSummary;
			const teamTypeClass = teamType === HomeAway.Away ? "away" : "home";
			const teamFileCode = teamType === HomeAway.Away ? gameSummary.away_file_code : gameSummary.home_file_code;
			const teamName = teamType === HomeAway.Away ? gameSummary.away_team_name : gameSummary.home_team_name;
			const teamCity = teamType === HomeAway.Away ? gameSummary.away_team_city : gameSummary.home_team_city;

			return(
				<div className={`team ${teamTypeClass}`}>
					<a className={`team-info`} href="/backers">
						<div className={`team-city team-color ${teamFileCode}`}>
							{teamCity}
						</div>
						<div className={`team-name team-color ${teamFileCode}`}>
							{teamName}
						</div>
					</a>
					<a className={`backers`} href="/backers">
						{this.getTeamSponsors(teamFileCode)}
					</a>
				</div>
			);
		}
	}

	App.addPage({
		page: <GameDetail />,
		matchingUrl: /^\/game\/(.*)/,
		name: "game"
	});
}