namespace Theater.MlbDataServer
{
	export class GameDetailCreator
	{
		private static readonly urlBase = "http://gd2.mlb.com";

		private readonly directoryUrl: string;
		private readonly highlightsUrl: string;
		private readonly gameCenterUrl: string;
		private readonly boxScoreUrl: string;
		private readonly inningsUrl: string;
		private readonly gameSummaryUrl: string;

		public constructor(directory: string, directoryIsFullyQualified = false)
		{
			this.directoryUrl = directoryIsFullyQualified
			                    ? directory
			                    : GameDetailCreator.urlBase + directory;

			this.highlightsUrl = this.directoryUrl + "/media/mobile.xml";
			this.gameCenterUrl = this.directoryUrl + "/gamecenter.xml";
			this.gameSummaryUrl = this.directoryUrl + "/linescore.xml";
			this.boxScoreUrl = this.directoryUrl + "/boxscore.xml";
			this.inningsUrl = this.directoryUrl + "/inning/inning_all.xml";
		}

		public async getHighlights()
		{
			const highlightsCollection = await Utils.XmlLoader.load<IHighlightsCollection>(this.highlightsUrl, "highlightsCollection");

			return highlightsCollection;
		}

		public async getGameCenter()
		{
			const gameCenterObj = await Utils.XmlLoader.load<IGameCenter>(this.gameCenterUrl, "gameCenter");

			return gameCenterObj;
		}

		public async getGameSummary()
		{
			const gameSummaryObj = await Utils.XmlLoader.load<IGameSummaryData>(this.gameSummaryUrl, "gameSummary");

			return gameSummaryObj;
		}

		public async getBoxscore()
		{
			const boxScoreObj = await Utils.XmlLoader.load<IBoxScoreContainer>(this.boxScoreUrl, "boxScore");

			return new BoxScoreData(boxScoreObj);
		}

		/**
		 * Gets the play-by-play for the game in question. 
		 * @param game Required to get information about players when they are only specified by ID
		 */
		public async getInnings(boxScore: BoxScoreData)
		{
			const inningsObj = await Utils.XmlLoader.load<IInningsContainer>(this.inningsUrl, "innings");

			return new Innings(inningsObj, boxScore);
		}

		private async get<T>(url: string)
		{
			try
			{
				return await Utils.XmlLoader.load<T>(url);
			}
			catch (e)
			{
				this.handleError(e);
			}
		}

		private handleError(e)
		{
			console.error(e);
		}
	}
}