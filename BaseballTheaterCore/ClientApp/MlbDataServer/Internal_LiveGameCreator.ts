import {LiveData, PlayerListResponse} from "./Contracts";
import Internal_DataLoader from "./Utils/Internal_DataLoader";
import * as moment from "moment/moment";

export default class Internal_LiveGameCreator
{
	private static readonly urlBase = "http://gd2.mlb.com";


	public async getLiveGame(gameId: number | string)
	{
		const liveGameUrl = `http://statsapi.mlb.com/api/v1.1/game/${gameId}/feed/live`;

		return await Internal_DataLoader.loadJson<LiveData>(liveGameUrl, "liveGame");
	}

	public async getPlayers(playerIds: number[], year: number = -1)
	{
		year = year === -1 ? moment().year() : year;
		const baseUrl = "https://statsapi.mlb.com/api/v1/people?";
		const playersQuery = "personIds=" + playerIds.join("&personIds=");
		const suffix = `&hydrate=stats(group=hitting,type=season,season=${year},gameType=R)`;
		
		const fullUrl = `${baseUrl}${playersQuery}${suffix}`;
		return await Internal_DataLoader.loadJson<PlayerListResponse>(fullUrl, "playerData");
	}
}
