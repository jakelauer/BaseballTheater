import {GameSummaryCollection} from "./Contracts";
import {Moment} from "moment/moment";
import Internal_DataLoader from "./Utils/Internal_DataLoader";
import Internal_DataLoaderNode from "@MlbDataServer/Utils/Internal_DataLoaderNode";

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
		return new Promise<GameSummaryCollection>((resolve, reject) => {
			const url = this.buildUrl(date);

			const gameSummaryCollectionDataPromise = Internal_DataLoader.loadXml<GameSummaryCollection>(url, "gameSummaryCollection");

			gameSummaryCollectionDataPromise.then(data => {
				resolve(new GameSummaryCollection(data));
			}).catch(error => reject(error));
		});
	}

	public static async getSummaryCollectionNode(date: Moment)
	{
		return new Promise<GameSummaryCollection>((resolve, reject) => {
			const url = this.buildUrl(date);

			const gameSummaryCollectionDataPromise = Internal_DataLoaderNode.loadXml<GameSummaryCollection>(url, "gameSummaryCollection");

			gameSummaryCollectionDataPromise.then(data => {
				resolve(new GameSummaryCollection(data));
			}).catch(error => reject(error));
		});
	}
}
