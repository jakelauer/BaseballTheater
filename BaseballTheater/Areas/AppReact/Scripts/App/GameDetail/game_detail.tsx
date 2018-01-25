namespace Theater
{
	interface IGameDetailData
	{
		gameSummary: GameSummary;
		boxScore: BoxScore;
		allHighlights: IHighlight[];
		specialHighlights: IHighlight[];
		detailMode: number;
	}

	export class GameDetailReact extends React.Component<any, IGameDetailData>
	{
		private date: moment.Moment = null;
		private gamePk: string;

		constructor(props: any)
		{
			super(props);

			this.date = this.getDateFromPath(location.pathname);
			this.gamePk = this.getGamePkFromPath(location.pathname);

			this.state = {
				detailMode: 0,
				boxScore: null,
				allHighlights: [],
				specialHighlights: [],
				gameSummary: null
			}
		}

		private switchDetailMode(e: React.MouseEvent<HTMLDivElement>, mode: number)
		{
			this.setState({
				detailMode: mode
			});
		}

		private showNoHighlights()
		{
			return true;
		}

		private getTeamSponsors(fileCode: string)
		{
			return 0;
		}

		private async getHighlights(currentGame: GameSummary): Promise<IHighlightsCollection>
		{
			if (currentGame !== null)
			{
				const gameDetailCreator = new MlbDataServer.GameDetailCreator(currentGame.game_data_directory, false);
				const highlights = await gameDetailCreator.getHighlights();
				return highlights;
			}

			return null;
		}

		private async getBoxScore(currentGame: GameSummary): Promise<BoxScore>
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
			const pathnameDateString = pathname.split("/")[3].replace(/[^0-9]/, "");
			const date = moment(pathnameDateString, "YYYYMMDD");
			return date;
		}

		private getGamePkFromPath(pathname: string)
		{
			const pathnamePk = pathname.split("/")[4].replace(/[^0-9]/, "");
			return pathnamePk;
		}

		private getCurrentGame(): Promise<GameSummary>
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

		public componentDidMount()
		{
			this.getData();
		}

		private async getData()
		{
			try
			{
				const currentGame = await this.getCurrentGame();
				const boxScore = await this.getBoxScore(currentGame);
				let highlights: IHighlight[] = [];
				let allHighlights: IHighlight[] = [];
				let specialHighlights: IHighlight[] = [];

				//$TODO hook up to favorite team
				if (currentGame.home_file_code === "")
				{
					//App.Instance.highlightsVueData.currentTab = "home";
				}

				const highlightsCollection = await this.getHighlights(currentGame);
				if (highlightsCollection && highlightsCollection.highlights && highlightsCollection.highlights.media)
				{
					for (let highlight of highlightsCollection.highlights.media)
					{
						highlight.isPlaying = false;
					}

					Theater.endTime = moment();

					highlights = highlightsCollection.highlights.media;
					highlights.sort((a, b) =>
					{
						var aIsRecap = a.recap ? -1 : 0;
						var bIsRecap = b.recap ? -1 : 0;
						var aIsCondensed = a.condensed ? -1 : 0;
						var bIsCondensed = b.condensed ? -1 : 0;
						var idOrder = a.id - b.id;

						return (aIsRecap - bIsRecap) || (aIsCondensed - bIsCondensed) || idOrder;
					});

					specialHighlights = highlights.filter((highlight) =>
					{
						return highlight.recap || highlight.condensed;
					});

					allHighlights = highlights.filter(highlight =>
					{
						return !highlight.recap && !highlight.condensed;
					});
				}

				this.setState({
					gameSummary: currentGame,
					boxScore,
					specialHighlights,
					allHighlights
				});
			}
			catch (e)
			{
				console.log(e);
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
			const allHighlights = this.state.allHighlights;
			const specialHighlights = this.state.specialHighlights;

			const highlightsOnClass = this.state.detailMode === 0 ? "on" : "";
			const boxScoreOnClass = this.state.detailMode === 1 ? "on" : "";

			return (
				<div className={`game-detail-container`}>
					<div className={`highlight-game-summary`}>

						{this.renderTeam(HomeAway.Away)}

						<GameSummaryReact game={gameSummary} />

						{this.renderTeam(HomeAway.Home)}

					</div>

					{boxScoreData && allHighlights &&
						<div data-vif="boxScore && allHighlights" className={`mode-switch-container`}>
							<div className={`mode-switch`}>
								<div className={`switch-item ${highlightsOnClass}`} onClick={e => this.switchDetailMode(e, 0)}>
									Highlights
								</div>
								<div className={`switch-item ${boxScoreOnClass}`} onClick={e => this.switchDetailMode(e, 1)}>
									Box Score
								</div>
							</div>
						</div>
					}

					<div className={`game-detail-wrapper`}>
						<div className={`highlights-wrapper ${highlightsOnClass}`}>
							{this.renderHighlights(specialHighlights, allHighlights)}

							{this.showNoHighlights() &&
								<div className={`empty`}>
									No highlights found for this game. Highlights for some games may not be published until the game is complete.
								</div>
							}
						</div>

						<div className={`box-score-wrapper ${boxScoreOnClass}`}>
							<BoxScoreReact boxScoreData={boxScoreData}/>
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

		private renderHighlights(specialHighlights: IHighlight[], allHighlights: IHighlight[])
		{
			if (allHighlights.length === 0)
			{
				return (<div/>);
			}

			return (
				<div className={`highlights-container`}>
					<h2>Highlights</h2>
					{specialHighlights && specialHighlights.length > 0 &&
						<div className={`special-highlights`}>
							{
								specialHighlights.map((highlight) => (
									<HighlightReact key={highlight.id} highlight={highlight} />
								))
							}
						</div>
					}

					<div className={`all-highlights`}>
						{
							allHighlights.map((highlight) => (
								<HighlightReact key={highlight.id} highlight={highlight} />
							))
						}
					</div>
				</div>
			);
		}
	}

	SiteReact.addPage({
		page: <GameDetailReact />,
		matchingUrl: /^\/react\/game\/(.*)/,
		name: "game"
	});
}