import {LiveData, PlayerListResponse} from "./Contracts";
import Internal_DataLoader from "./Utils/Internal_DataLoader";
import * as moment from "moment/moment";

export default class Internal_LiveGameCreator
{
	static async getLiveGame(gameId: number | string)
	{
		const liveGameUrl = `http://statsapi.mlb.com/api/v1.1/game/${gameId}/feed/live`;

		return await Internal_DataLoader.loadJson<LiveData>(liveGameUrl, "liveGame");
	}

	static async getGameMedia(gameId: number | string)
	{
		const mediaUrl = `https://statsapi.mlb.com/api/v1/game/${gameId}/content?language=en`;
		
		return await Internal_DataLoader.loadJson<GameMedia>(mediaUrl, "media");
	}

	static async getPlayers(playerIds: number[], year: number = -1)
	{
		year = year === -1 ? moment().year() : year;
		const baseUrl = "https://statsapi.mlb.com/api/v1/people?";
		const playersQuery = "personIds=" + playerIds.join("&personIds=");
		const suffix = `&hydrate=stats(group=hitting,type=season,season=${year},gameType=R)`;

		const fullUrl = `${baseUrl}${playersQuery}${suffix}`;
		return await Internal_DataLoader.loadJson<PlayerListResponse>(fullUrl, "playerData");
	}
}
