namespace Theater.MlbDataServer
{
	export class GameSummaryCreator
	{
		private static readonly urlBase = `http://gd2.mlb.com`;

		private static buildUrl(date: moment.Moment)
		{
			const yearFolder = `year_${date.format("YYYY")}`;
			const monthFolder = `month_${date.format("MM")}`;
			const dayFolder = `day_${date.format("DD")}`;

			return `${this.urlBase}/components/game/mlb/${yearFolder}/${monthFolder}/${dayFolder}/scoreboard_android.xml`;
		}

		public static async getSummaryCollection(date: moment.Moment)
		{
			const url = this.buildUrl(date);

			const gameSummaryCollectionData = await Utils.XmlLoader.load<GameSummaryCollection>(url, "gameSummaryCollection");

			const gameSummaryCollection = new GameSummaryCollection(gameSummaryCollectionData);

			return gameSummaryCollection;
		}
	}
}