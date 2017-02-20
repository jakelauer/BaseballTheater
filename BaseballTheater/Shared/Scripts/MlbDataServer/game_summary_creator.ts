namespace Theater.MlbDataServer
{
	export class GameSummaryCreator
	{
		private static readonly urlBase = "http://gd2.mlb.com";

		private static buildUrl(date: moment.Moment)
		{
			var yearFolder = `year_${date.format("YYYY")}`;
			var monthFolder = `month_${date.format("MM")}`;
			var dayFolder = `day_${date.format("DD")}`;

			return `${this.urlBase}/components/game/mlb/${yearFolder}/${monthFolder}/${dayFolder}/master_scoreboard.xml`;
		}

		public static async getSummaryCollection(date: moment.Moment)
		{
			var url = this.buildUrl(date);

			var gameSummaryCollection = await Utils.XmlLoader.load<IGameSummaryCollection>(url);

			return gameSummaryCollection;
		}
	}
}