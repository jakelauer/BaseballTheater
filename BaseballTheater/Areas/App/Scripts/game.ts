namespace Theater
{
	export interface IHighlightsVueData
	{
		highlights: IHighlight[];
	}

	export class Game extends Site.Page
	{
		public static Instance = new Game();

		private date: moment.Moment = null;
		private gamePk: string;

		public initialize()
		{
			this.date = this.getDateFromPath(location.pathname);
			this.gamePk = this.getGamePkFromPath(location.pathname);

			Site.startLoading();

			this.getData().then(() =>
			{
				Site.stopLoading();
			});
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
		}

		private async getData()
		{
			try
			{
				const currentGame = await this.getCurrentGame();
				const highlightsCollection = await this.getHighlights(currentGame);
				if (highlightsCollection && highlightsCollection.highlights && highlightsCollection.highlights.media)
				{
					for (var highlight of highlightsCollection.highlights.media)
					{
						highlight.isPlaying = false;
					}
					App.Instance.highlightsVueData.highlights = highlightsCollection.highlights.media;
				}
			} catch (e)
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
		page: Game.Instance,
		matchingUrl: /^\/game\/(.*)/
	});
}