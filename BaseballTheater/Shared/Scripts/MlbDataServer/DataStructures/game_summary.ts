namespace Theater
{
	export interface IGameSummary
	{
		id: string;
		gamePk: number;
		date: string;
		gameType: string;
		eventTime: string;
		eventTimeAmPm: string;
		timeZone: string;
		dateObj: Date;
		status: GameStatus;
		league: string;
		inning: string;
		awayTeamNameAbbr: string;
		awayTeamName: string;
		awayFileCode: string;
		homeTeamNameAbbr: string;
		homeTeamName: string;
		homeFileCode: string;
		gameDataDirectory: string;
		linescore: Linescore;
	}
}