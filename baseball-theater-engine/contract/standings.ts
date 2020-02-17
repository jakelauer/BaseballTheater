import {AbstractIdLink, AbstractIdLinkName, GameTeam} from "./live";

export interface Standings
{
	records: StandingsRecord[];
}

export interface StandingsRecord
{
	standingsType: string;
	league: League;
	division: Division;
	sport: Sport;
	lastUpdated: string;
	teamRecords: TeamRecord[];
}

export interface League extends AbstractIdLinkName
{
	abbreviation: string;
	nameShort: string;
	seasonState: string;
	hasWildCard: boolean;
	hasSplitSeason: boolean;
	numGames: number;
	hasPlayoffPoints: boolean;
	numTeams: number;
	numWildcardTeams: number;
	seasonDateInfo: SeasonDateInfo;
	season: string;
	orgCode: string;
	conferenceInUse: boolean;
	divisionsInUse: boolean;
	sport: AbstractIdLink;
	sortOrder: number;
}

export interface SeasonDateInfo
{
	regularSeasonStartDate: string;
	regularSeasonEndDate: string;
	preSeasonStartDate: string;
	preSeasonEndDate: string;
	postSeasonStartDate: string;
	postSeasonEndDate: string;
	lastDate1stHalf: string;
	firstDate2ndHalf: string;
	allStarDate: string;
}

export interface Division extends AbstractIdLinkName
{
	nameShort: string;
	abbreviation: string;
	league: AbstractIdLink;
	sport: AbstractIdLink;
	hasWildcard: boolean;
}

export interface Sport extends AbstractIdLinkName
{
	code: string;
	abbreviation: string;
	sortOrder: number;
	activeStatus: boolean;
}

export interface TeamRecord
{
	team: GameTeam;
	season: string;
	streak: {
		streakType: string;
		streakNumber: number;
		streakCode: string;
	};
	clinchIndicator: string;
	divisionRank: string;
	leagueRank: string;
	sportRank: string;
	gamesPlayed: number;
	gamesBack: string;
	wildCardGamesBack: string;
	leagueGamesBack: string;
	springLeagueGamesBack: string;
	sportGamesBack: string;
	divisionGamesBack: string;
	conferenceGamesBack: string;
	leagueRecord: {
		wins: number;
		losses: number;
		pct: string;
	};
	lastUpdated: string;
	records: {
		splitRecords: RecordWithType[];
		divisionRecords: DivisionRecord[];
		overallRecords: RecordWithType[];
		leagueRecords: LeagueRecord[];
		expectedRecords: RecordWithType[];
	};
	runsAllowed: number;
	runsScored: number;
	divisionChamp: boolean;
	divisionLeader: boolean;
	hasWildcard: boolean;
	clinched: boolean;
	eliminationNumber: string;
	wildCardEliminationNumber: string;
	magicNumber: string;
	wins: number;
	losses: number;
	runDifferential: number;
	winningPercentage: string;
}

export interface BasicRecord
{
	wins: number;
	losses: number;
	pct: string;
}

export interface RecordWithType extends BasicRecord
{
	type: string;
}

export interface DivisionRecord extends BasicRecord
{
	division: AbstractIdLinkName;
}

export interface LeagueRecord extends BasicRecord
{
	league: AbstractIdLinkName;
}
