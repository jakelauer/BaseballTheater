import {AbstractHomeAway, AbstractIdLinkName, LiveGameLinescore, Player} from "./live";
import {ITeams} from "./teams";
import {GameMedia} from "./media";

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
	flags?: {
		awayTeamNoHitter: boolean;
		awayTeamPerfectGame: boolean;
		homeTeamNoHitter: boolean;
		homeTeamPerfectGame: boolean;
		noHitter: boolean;
		perfectGame: boolean;

	}
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
	content: GameMedia;
}

export interface IScheduleGameDecisions
{
	winner: Player;
	loser: Player;
	save: Player;
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
	fileCode: keyof ITeams;
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
