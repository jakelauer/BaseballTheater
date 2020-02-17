import {IScheduleGame} from "./contract/teamschedule";

export class MlbUtils
{
	public static gameIsOver(game: IScheduleGame)
	{
		return game.status.statusCode === "F";
	}
}