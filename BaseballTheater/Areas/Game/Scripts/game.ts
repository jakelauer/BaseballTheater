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

		private highlightsVueData: IHighlightsVueData = {
			highlights: []
		}
		private highlightsVue: vuejs.Vue;

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
			this.highlightsVue = new Vue({
				el: ".highlights",
				data: this.highlightsVueData,
				methods: {
				}
			});
		}

		public renew(pathname: string)
		{
			this.initialize();
		}

		public destroy()
		{
			this.highlightsVueData.highlights = [];
		}

		private async getData()
		{
			try
			{
				var currentGame = await this.getCurrentGame();
				var highlightsCollection = await this.getHighlights(currentGame);
				if (highlightsCollection && highlightsCollection.highlights && highlightsCollection.highlights.media)
				{
					this.highlightsVueData.highlights = highlightsCollection.highlights.media;
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
				var summaries = MlbDataServer.GameSummaryCreator.getSummaryCollection(this.date);

				summaries.then((result) =>
				{
					var gameSummaryCollection = new GameSummaryCollection(result);
					if (gameSummaryCollection.games && gameSummaryCollection.games.games)
					{
						let gameList = gameSummaryCollection.games.games;
						for (let game of gameList)
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

		private async getHighlights(currentGame: GameSummary)
		{
			if (currentGame !== null)
			{
				var gameDetailCreator = new MlbDataServer.GameDetailCreator(currentGame.game_data_directory, false);
				var highlights = await gameDetailCreator.getHighlights();
				return highlights;
			}
		}

		private getDateFromPath(pathname: string)
		{
			let pathnameDateString = pathname.split("/")[2].replace(/[^0-9]/, "");
			let date = moment(pathnameDateString, "YYYYMMDD");
			return date;
		}

		private getGamePkFromPath(pathname: string)
		{
			let pathnamePk = pathname.split("/")[3].replace(/[^0-9]/, "");
			return pathnamePk;
		}

	}

	Site.addPage({
		bodySelector: "body.Game",
		page: Game.Instance,
		matchingUrl: /^\/game\/(.*)/
	});
}