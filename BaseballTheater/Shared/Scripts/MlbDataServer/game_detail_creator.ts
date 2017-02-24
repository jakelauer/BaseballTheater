namespace Theater.MlbDataServer
{
	export class GameDetailCreator
	{
		private static readonly urlBase = "http://gd2.mlb.com";

		private directoryUrl: string;
		private highlightsUrl: string;
		private gameCenterUrl: string;
		private gameSummaryUrl: string;

		public constructor(directory: string, directoryIsFullyQualified = false)
		{
			this.directoryUrl = directoryIsFullyQualified
				? directory
				: GameDetailCreator.urlBase + directory;

			this.highlightsUrl = this.directoryUrl + "/media/mobile.xml";
			this.gameCenterUrl = this.directoryUrl + "/gamecenter.xml";
			this.gameSummaryUrl = this.directoryUrl + "/linescore.xml";
		}

		public async getHighlights()
		{
			const highlightsCollection = await Utils.XmlLoader.load<IHighlightsCollection>(this.highlightsUrl, "highlightsCollection");

			return highlightsCollection;
		}

		public async getGameCenter(): Promise<IGameCenter>
		{
			const gameCenterObj = await Utils.XmlLoader.load<IGameCenter>(this.gameCenterUrl, "gameCenter");

			return gameCenterObj;
		}

		public async getGameSUmmary()
		{
			const gameSummaryObj = await Utils.XmlLoader.load<IGameSummary>(this.gameSummaryUrl, "gameSummary");

			return gameSummaryObj;
		}

		private async get<T>(url: string): Promise<T>
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