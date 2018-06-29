import {LiveData, PlayerListResponse} from "./Contracts";
import Internal_DataLoader from "./Utils/Internal_DataLoader";
import * as moment from "moment/moment";
import {ISchedule} from "@MlbDataServer/Contracts/TeamSchedule";

export default class Internal_LiveGameCreator
{
	public async getLiveGame(gameId: number | string)
	{
		const liveGameUrl = `http://statsapi.mlb.com/api/v1.1/game/${gameId}/feed/live`;

		return await Internal_DataLoader.loadJson<LiveData>(liveGameUrl, "liveGame");
	}

	public async getGameMedia(gameId: number | string)
	{
		const mediaUrl = `https://statsapi.mlb.com/api/v1/game/${gameId}/content?language=en`;

		return await Internal_DataLoader.loadJson<GameMedia>(mediaUrl, "media");
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

	public async getTeamSchedule(teamId: number)
	{
		const now = moment();
		const dateString = now.format("YYYY-MM-DD");
		const season = now.year();
		
		const url = `https://statsapi.mlb.com/api/v1/teams/112?hydrate=previousSchedule(date=${dateString},season=${season},limit=162,gameType=%5BE,S,R,A,F,D,L,W%5D,team,linescore(matchup,runners),decisions,person,stats,seriesStatus(useOverride=true)),nextSchedule(date=${dateString},season=${season},limit=162,gameType=%5BE,S,R,A,F,D,L,W%5D,team,linescore(matchup,runners),decisions,person,stats,seriesStatus(useOverride=true))&language=en`;
		
		return await Internal_DataLoader.loadJson<ISchedule>(url,  "schedule" + teamId);
	}
}