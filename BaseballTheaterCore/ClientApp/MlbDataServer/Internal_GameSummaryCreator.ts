import {GameSummaryCollection} from "./Contracts";
import {Moment} from "moment/moment"
import Internal_DataLoader from "./Utils/Internal_DataLoader";

export default class Internal_GameSummaryCreator
{
	private static readonly urlBase = `http://gd2.mlb.com`;

	private static buildUrl(date: Moment)
	{
		const yearFolder = `year_${date.format("YYYY")}`;
		const monthFolder = `month_${date.format("MM")}`;
		const dayFolder = `day_${date.format("DD")}`;

		return `${this.urlBase}/components/game/mlb/${yearFolder}/${monthFolder}/${dayFolder}/master_scoreboard.xml`;
	}

	public static async getSummaryCollection(date: Moment)
	{
		const url = this.buildUrl(date);

		const gameSummaryCollectionData = await Internal_DataLoader.loadXml<GameSummaryCollection>(url, "gameSummaryCollection");

		const gameSummaryCollection = new GameSummaryCollection(gameSummaryCollectionData);

		return gameSummaryCollection;
	}
}
