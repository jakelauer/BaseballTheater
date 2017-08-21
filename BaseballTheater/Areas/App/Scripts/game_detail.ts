namespace Theater
{

	export interface IHighlightsVueData
	{
		allHighlights: IHighlight[];
		homeHighlights: IHighlight[];
		awayHighlights: IHighlight[];
		specialHighlights: IHighlight[];
		gameSummary: GameSummary;
		boxScore: BoxScore;
		currentTab: string;
		detailMode: DetailModes;
	}

	export class GameDetail extends Site.Page
	{
		public static Instance = new GameDetail();

		private date: moment.Moment = null;
		private gamePk: string;

		public initialize()
		{
			Theater.startTime = moment();
			this.date = this.getDateFromPath(location.pathname);
			this.gamePk = this.getGamePkFromPath(location.pathname);

			Site.startLoading();

			this.getData().then(() =>
			{
				Site.stopLoading();
			});

			App.Instance.settingsVueData.showingGameList = false;
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
			App.Instance.highlightsVueData.homeHighlights = [];
			App.Instance.highlightsVueData.awayHighlights = [];
			App.Instance.highlightsVueData.specialHighlights = [];
			App.Instance.highlightsVueData.gameSummary = null;
			App.Instance.highlightsVueData.boxScore = null;
		}

		private async getData()
		{
			try
			{
				const currentGame = await this.getCurrentGame();
				const boxScore = await this.getBoxScore(currentGame);
				if (boxScore !== null)
				{
					App.Instance.highlightsVueData.boxScore = boxScore;
				}

				App.Instance.highlightsVueData.gameSummary = currentGame;

				if (currentGame.home_file_code === App.Instance.settingsVueData.favoriteTeam)
				{
					App.Instance.highlightsVueData.currentTab = "home";
				}

				const highlightsCollection = await this.getHighlights(currentGame);
				if (highlightsCollection && highlightsCollection.highlights && highlightsCollection.highlights.media)
				{
					for (let highlight of highlightsCollection.highlights.media)
					{
						highlight.isPlaying = false;
					}

					Theater.endTime = moment();

					const highlights = highlightsCollection.highlights.media;
					highlights.sort((a, b) =>
					{
						var aIsRecap = a.recap ? -1 : 0;
						var bIsRecap = b.recap ? -1 : 0;
						var aIsCondensed = a.condensed ? -1 : 0;
						var bIsCondensed = b.condensed ? -1 : 0;
						var idOrder = a.id - b.id;

						return (aIsRecap - bIsRecap) || (aIsCondensed - bIsCondensed) || idOrder;
					});

					if (boxScore != null)
					{
						const homeHighlights = highlights.filter((highlight) =>
						{
							return highlight.team_id === boxScore.home_id;
						});

						const awayHighlights = highlights.filter((highlight) => {
							return highlight.team_id === boxScore.away_id;
						});

						App.Instance.highlightsVueData.homeHighlights = homeHighlights;
						App.Instance.highlightsVueData.awayHighlights = awayHighlights;
					}

					const specialHighlights = highlights.filter((highlight) =>
					{
						return highlight.recap || highlight.condensed;
					});

					App.Instance.highlightsVueData.specialHighlights = specialHighlights;

					App.Instance.highlightsVueData.allHighlights = highlights;
				}
				else
				{
					App.Instance.highlightsVueData.awayHighlights = [];
					App.Instance.highlightsVueData.homeHighlights = [];
					App.Instance.highlightsVueData.allHighlights = [];
				}
			}
			catch (e)
			{
				console.log(e);
			}
		}

		private getCurrentGame(): Promise<GameSummary>
		{
			return new Promise((resolve, reject) =>
			{
				const summaries = MlbDataServer.GameSummaryCreator.getSummaryCollection(this.date);

				summaries.then((gameSummaryCollection) =>
				{
					if (gameSummaryCollection.games && gameSummaryCollection.games.games)
					{
						const gameList = gameSummaryCollection.games.games;
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
			const pathnameDateString = pathname.split("/")[2].replace(/[^0-9]/, "");
			const date = moment(pathnameDateString, "YYYYMMDD");
			return date;
		}

		private getGamePkFromPath(pathname: string)
		{
			const pathnamePk = pathname.split("/")[3].replace(/[^0-9]/, "");
			return pathnamePk;
		}
	}

	Site.addPage({
		page: GameDetail.Instance,
		matchingUrl: /^\/game\/(.*)/,
		name: "game"
	});
}