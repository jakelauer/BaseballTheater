namespace Theater
{
	export interface IHighlightsVueData
	{
		highlights: IHighlight[];
		gameSummary: GameSummary;
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
			App.Instance.highlightsVueData.highlights = [];
			App.Instance.highlightsVueData.gameSummary = null;
		}

		private async getData()
		{
			try
			{
				const currentGame = await this.getCurrentGame();

				App.Instance.highlightsVueData.gameSummary = currentGame;

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

						return (aIsRecap - bIsRecap) || (aIsCondensed - bIsCondensed);
					});

					App.Instance.highlightsVueData.highlights = highlights;
				}
				else
				{
					App.Instance.highlightsVueData.highlights = [];
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

				summaries.then((result) =>
				{
					const gameSummaryCollection = new GameSummaryCollection(result);
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
		matchingUrl: /^\/game\/(.*)/
	});
}