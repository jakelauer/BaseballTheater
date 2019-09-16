import {AbstractHomeAway, AbstractIdLinkName, LiveGameLinescore, Player} from "./live";

export interface ISchedule
{
	teams: IScheduleTeamSchedule[];
}

export interface ITeamDetails
{
	teams: IScheduleTeam[];
}

export interface IScheduleTeamSchedule extends IScheduleTeam
{
	nextGameSchedule: IScheduleGameList;
	previousGameSchedule: IScheduleGameList;
}

export interface IScheduleGameList extends IScheduleItemCount
{
	dates: IScheduleDate[];
}

export interface IScheduleDate extends IScheduleItemCount
{
	date: string;
	games: IScheduleGame[];
}

export interface IScheduleGame
{
	gamePk: string;
	gameType: "S";
	season: string;
	gameDate: string;
	status: IScheduleGameStatus;
	teams: AbstractHomeAway<IScheduleTeamItem>;
	linescore: LiveGameLinescore;
	doubleHeader: "Y" | "N";
	gamedayType: string;
	tiebreaker: "Y" | "N";
	gameNumber: number;
	calendarEventID: string;
	seasonDisplay: string;
	dayNight: "day" | "night";
	scheduledInnings: number;
	gamesInSeries: number;
	seriesGameNumber: number;
	seriesDescription: string;
	decisions: IScheduleGameDecisions;
}

export interface IScheduleGameDecisions
{
	winner: Player;
	loser: Player;
}

export interface IScheduleTeamItem
{
	leagueRecord: IScheduleTeamRecord;
	probablePitcher: Player;
	score: number;
	team: IScheduleTeam;
	isWinner: boolean;
	splitSquad: boolean;
	seriesNumber: number;
}

export interface IScheduleTeam extends AbstractIdLinkName
{
	season: number;
	venue: AbstractIdLinkName;
	teamCode: string;
	fileCode: string;
	abbreviation: string;
	teamName: string;
	locationName: string;
	firstYearOfPlay: string;
	league: AbstractIdLinkName;
	division: AbstractIdLinkName;
}

export interface IScheduleTeamRecord
{
	wins: number;
	losses: number;
	pct: string;
}

export interface IScheduleGameStatus
{
	abstractGameState: string;
	codedGameState: string;
	detailedState: string;
	statusCode: string;
	abstractGameCode: string;
}

export interface IScheduleItemCount
{
	totalItems: number;
	totalEvents: number;
	totalGames: number;
	totalGamesInProgress: number;
}
