namespace Theater.MlbDataServer
{
	export class GameSummaryCreator
	{
		private static readonly urlBase = "http://gd2.mlb.com";

		private static buildUrl(date: moment.Moment)
		{
			const yearFolder = `year_${date.format("YYYY")}`;
			const monthFolder = `month_${date.format("MM")}`;
			const dayFolder = `day_${date.format("DD")}`;

			return `${this.urlBase}/components/game/mlb/${yearFolder}/${monthFolder}/${dayFolder}/master_scoreboard.xml`;
		}

		public static async getSummaryCollection(date: moment.Moment)
		{
			const url = this.buildUrl(date);

			const gameSummaryCollection = await Utils.XmlLoader.load<IGameSummaryCollection>(url);

			return gameSummaryCollection;
		}
	}
}