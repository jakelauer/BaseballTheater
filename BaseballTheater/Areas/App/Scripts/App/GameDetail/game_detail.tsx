namespace Theater.GameDetail
{
	export enum Tabs
	{
		Highlights,
		PlayByPlay,
		BoxScore
	}

	interface IGameDetailState
	{
		gameSummary: GameSummaryData | null;
		boxScore: BoxScoreData | null;
		highlightsCollection: IHighlightsCollection | null;
		playByPlay: IInningsContainer | null;
		currentTab: Tabs;
	}

	export class GameDetail extends React.Component<any, IGameDetailState>
	{
		private readonly date: moment.Moment;
		private readonly gamePk: string;
		private liveSubscription: Theater.Utility.Subscription<IGameUpdateDistributorPayload>;

		constructor(props: any)
		{
			super(props);

			this.date = this.getDateFromPath(location.pathname);
			this.gamePk = this.getGamePkFromPath(location.pathname);

			const hashState = Utility.LinkHandler.parseHash();
			let currentTab = ("tab" in hashState)
				? parseInt(hashState["tab"]) as Tabs
				: Tabs.Highlights;

			if (App.Instance.isAppMode)
			{
				currentTab = Tabs.BoxScore;
			}

			this.state = {
				boxScore: null,
				highlightsCollection: null,
				gameSummary: null,
				playByPlay: null,
				currentTab
			}
		}

		public componentDidMount()
		{
			this.getData();
			this.subscribeToLiveData();
		}

		public componentWillUnmount()
		{
			this.unsubscribeToLiveData();
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
			const gameDetailCreator = new MlbDataServer.GameDetailCreator(currentGame.game_data_directory, false);
			const highlights = await gameDetailCreator.getHighlights();
			return highlights;
		}

		private async getBoxScore(currentGame: GameSummaryData): Promise<BoxScoreData>
		{
			const gameDetailCreator = new MlbDataServer.GameDetailCreator(currentGame.game_data_directory, false);
			const boxScore = await gameDetailCreator.getBoxscore();
			return boxScore;
		}

		private async getPlayByPlay(currentGame: GameSummaryData, boxScore: BoxScoreData): Promise<Innings>
		{
			const gameDetailCreator = new MlbDataServer.GameDetailCreator(currentGame.game_data_directory, false);
			const playByPlay = await gameDetailCreator.getInnings(boxScore);
			return playByPlay;
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

		private subscribeToLiveData()
		{
			this.liveSubscription = App.Instance.gameUpdateDistributor.subscribe(payload =>
			{
				if (payload.gameIds.indexOf(parseInt(this.gamePk)) > -1)
				{
					console.log("Live update triggered.");
					this.getData();
				}
			})
		}

		private unsubscribeToLiveData()
		{
			if (this.liveSubscription)
			{
				App.Instance.gameUpdateDistributor.unsubscribe(this.liveSubscription);
			}
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
				const highlightsCollectionPromise = this.getHighlights(gameSummary);
				const playByPlayPromise = this.getPlayByPlay(gameSummary, boxScore);
				
				const both = await Promises.all([highlightsCollectionPromise, playByPlayPromise]);
				const highlightsCollection = (!(both[0] instanceof Error)) 
					? both[0] as IHighlightsCollection 
					: null;

				const playByPlay = (!(both[1] instanceof Error))
					? both[1] as Innings
					: null;
				

				this.setState({
					gameSummary,
					boxScore,
					highlightsCollection,
					playByPlay
				});

				App.stopLoading();
			}
			catch (e)
			{
				console.log(e);

				App.stopLoading();
			}
		}

		private renderCurrentTab(currentTab: Tabs | null)
		{
			const boxScoreData = this.state.boxScore;
			const highlightsCollection = this.state.highlightsCollection;
			const playByPlayData = this.state.playByPlay;
			const gameSummary = this.state.gameSummary;
			const allPlayers = boxScoreData ? boxScoreData.allPlayers : new Map();

			let renderables = [<div/>];

			switch (currentTab)
			{
				case Tabs.Highlights:
					if (!highlightsCollection
						|| !highlightsCollection.highlights
						|| !highlightsCollection.highlights.media
						|| highlightsCollection.highlights.media.length === 0)
					{
						renderables = [
							<div key={0} className="no-data">No box score data is available for this game.</div>
						];
					}
					else
					{
						renderables = [
							<Highlights highlightsCollection={highlightsCollection} key={0}/>
						];

					}
					break;
				case Tabs.BoxScore:
					if (!boxScoreData)
					{
						renderables = [
							<div key={0} className="no-data">No box score data is available for this game.</div>
						];
					}
					else
					{
						renderables = [
							<MiniBoxScore boxScoreData={boxScoreData} key={0}/>,
							<BoxScore boxScoreData={boxScoreData} key={1}/>
						];
					}
					break;
				case Tabs.PlayByPlay:
					if (!boxScoreData || !gameSummary || !playByPlayData)
					{
						renderables = [
							<div key={0} className="no-data">No play-by-play data is available for this game.</div>
						];
					}
					else
					{
						renderables = [
							<MiniBoxScore boxScoreData={boxScoreData} key={0}/>,
							<PlayByPlay
								key={1}
								gameSummary={gameSummary}
								inningsData={playByPlayData}
								highlights={highlightsCollection}
								allPlayers={allPlayers}/>
						];
					}
					break;
			}

			return (
				<div className={`tab-content on`} data-tab={currentTab}>
					{renderables}
				</div>
			);
		}

		public render()
		{
			const gameSummary = this.state.gameSummary;
			if (!gameSummary)
			{
				return (<div/>);
			}

			const highlightsTabClass = this.state.currentTab === Tabs.Highlights ? "on" : "";
			const playByPlayTabClass = this.state.currentTab === Tabs.PlayByPlay ? "on" : "";
			const boxScoreTabClass = this.state.currentTab === Tabs.BoxScore ? "on" : "";

			return (
				<div className={`game-detail-container`}>
					<div className={`game-data-tab-container`}>
						<div className={`tabs`}>
							<a href={`#tab=${Tabs.Highlights}`} className={`tab ${highlightsTabClass}`} onClick={_ => this.setTabState(Tabs.Highlights)}>
								<span>Highlights</span>
							</a>
							<a href={`#tab=${Tabs.PlayByPlay}`} className={`tab ${playByPlayTabClass}`} onClick={_ => this.setTabState(Tabs.PlayByPlay)}>
								<span>Play by Play</span>
							</a>
							<a href={`#tab=${Tabs.BoxScore}`} className={`tab ${boxScoreTabClass}`} onClick={_ => this.setTabState(Tabs.BoxScore)}>
								<span>Box Score</span>
							</a>
						</div>
						<div className={`tab-contents`}>
							{this.renderCurrentTab(this.state.currentTab)}
						</div>
					</div>
				</div>
			);
		}
	}

	App.Instance.addPage({
		page: <GameDetail/>,
		matchingUrl: /^\/game\/(.*)/gi,
		name: "game"
	});
}