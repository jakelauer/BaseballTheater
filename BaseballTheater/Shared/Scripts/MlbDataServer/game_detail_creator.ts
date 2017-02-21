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
			return await Utils.XmlLoader.load<IHighlightsCollection>(this.highlightsUrl);
		}

		public async getGameCenter(): Promise<IGameCenter>
		{
			var gameCenterObj = await Utils.XmlLoader.load<IGameCenter>(this.gameCenterUrl);

			return gameCenterObj;
		}

		public async getGameSUmmary()
		{
			var gameSummaryObj = await Utils.XmlLoader.load<IGameSummary>(this.gameSummaryUrl);

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