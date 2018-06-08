export type StringBoolean = "Y" | "N";

export interface LiveData
{
	gamePk: number;
	link: string;
	gameData: GameData;
	liveData: LiveGameData;
}

export interface LiveGameData
{
	plays: LiveGamePlays;
	linescore: LiveGameLinescore;
	boxscore: LiveGameBoxscore;
	decisions: {
		winner: AbstractFullnameIdLink;
		loser: AbstractFullnameIdLink;
		save?: AbstractFullnameIdLink;
	}
}

export interface LiveGameBoxscore
{
	teams: {
		away: BoxscoreTeam;
		home: BoxscoreTeam;
	}
	officials: LiveGameBoxscoreOfficial[];
	info: LabelValue[];
	pitchingNotes: any[];
}

export interface LabelValue
{
	label: string;
	value: string;
}

export interface LiveGameBoxscoreOfficial
{
	official: AbstractFullnameIdLink;
	officialType: string;
}

export interface BoxscoreTeam extends AbstractIdLinkName
{
	team: AbstractIdLinkName;
}

export interface LiveGameLinescore
{
	currentInning: number;
	currentInningOrdinal: string;
	inningState: string;
	inningHalf: string;
	isTopInning: boolean;
	scheduledInnings: number;
	innings: LiveGameInning[];
	teams: {
		home: LiveGameLinescoreRHE;
		away: LiveGameLinescoreRHE;
	}
	defense: {
		pitcher: AbstractFullnameIdLink;
		catcher: AbstractFullnameIdLink;
		first: AbstractFullnameIdLink;
		second: AbstractFullnameIdLink;
		third: AbstractFullnameIdLink;
		shortstop: AbstractFullnameIdLink;
		left: AbstractFullnameIdLink;
		center: AbstractFullnameIdLink;
		right: AbstractFullnameIdLink;
	},
	offense: {
		batter: AbstractFullnameIdLink;
		onDeck: AbstractFullnameIdLink;
		inHole: AbstractFullnameIdLink;
		first: AbstractFullnameIdLink;
		second: AbstractFullnameIdLink;
		third: AbstractFullnameIdLink;
		pitcher: AbstractFullnameIdLink;
	},
	balls: number;
	strikes: number;
	outs: number;
}

export interface LiveGameLinescoreRHE
{
	runs: number;
	hits: number;
	errors: number;
}

export interface LiveGameInning
{
	num: number;
	ordinalNum: string;
	home: LiveGameInningRuns;
	away: LiveGameInningRuns;
}

export interface LiveGameInningRuns
{
	runs?: number;
}

export interface LiveGamePlays
{
	allPlays: LiveGamePlay[];
	currentPlay: LiveGamePlay;
	playsByInning: LiveGamePlayByInning[];
	scoringPlays: number[];
}

export interface LiveGamePlayByInning
{
	startIndex: number;
	endIndex: number;
	top: number[];
	bottom: number[];
	hits: AbstractHomeAway<LiveGamePlayHit>
}

export interface AbstractHomeAway<T>
{
	home: T;
	away: T;
}

export interface LiveGamePlayHit
{
	batter: AbstractFullnameIdLink;
	coordinates: XYCoordinates;
	description: string;
	inning: number;
	pitcher: AbstractFullnameIdLink;
	team: AbstractIdLinkName;
	type: string;
}

export interface LiveGamePlay
{
	result: LiveGamePlayResult;
	about: LiveGamePlayAbout;
	count: LiveGamePlayCount;
	matchup: LiveGamePlayMatchup;
	pitchIndex: number[];
	actionIndex: number[];
	runnerIndex: number[];
	runners: Runner[];
	playEvents: LiveGamePlayEvent[];
}

export interface LiveGamePlayEvent
{
	details: LiveGamePlayEventDetails;
	count: LiveGamePlayEventCount;
	pitchData: LiveGamePlayEventPitchData;
	index: number;
	pitchNumber: number;
	startTime: string;
	endTime: string;
	isPitch: boolean;
	playId: string;
	type: string;
}

export interface LiveGamePlayEventCount
{
	balls: number;
	strikes: number;
}

export interface LiveGamePlayEventPitchData
{
	endSpeed: number;
	nastyFactor: number;
	startSpeed: number;
	strikeZoneBottom: number;
	strikeZoneTop: number;
	coordinates: PitchCoordinates;
	breaks: PitchBreaks;
}

export interface PitchBreaks
{
	breakAngle: number;
	breakLength: number;
	breakY: number;
}

export interface XYCoordinates
{
	x: number;
	y: number;
}

export interface PitchCoordinates
{
	aX: number;
	aY: number;
	aZ: number;
	pX: number;
	pZ: number;
	pfxX: number;
	pfxZ: number;
	vX0: number;
	vY0: number;
	vZ0: number;
	x: number;
	x0: number;
	y: number;
	y0: number;
	z0: number;
}

export interface LiveGamePlayEventDetails extends CodeDescription
{
	call: CodeDescription;
	ballColor: string;
	isInPlay: boolean;
	isStrike: boolean;
	isBall: boolean;
	hasReview: boolean;
	trailColor: string;
	type: CodeDescription;
}

export interface Runner
{
	movement: RunnerMovement;
	details: RunnerDetails;
}

export interface RunnerDetails
{
	event: string;
	runner: AbstractFullnameIdLink;
	isScoringEvent: boolean;
	rbi: boolean;
	earned: boolean;
}

export interface RunnerMovement
{
	start: string;
	end: string;
}

export interface LiveGamePlayMatchup
{
	batter: AbstractFullnameIdLink;
	batSide: CodeDescription;
	pitcher: AbstractFullnameIdLink;
	pitchHand: CodeDescription;
	batterHotColdZoneStats: any;
}

export interface LiveGamePlayCount
{
	balls: number;
	strikes: number;
	outs: number;
}

export interface LiveGamePlayAbout
{
	atBatIndex: number;
	halfInning: "top" | "bottom";
	inning: number;
	startTime: string;
	endTime: string;
	isComplete: boolean;
	isScoringPlay: boolean;
	hasReview: boolean;
	hasOut: boolean;
	captivatingIndex: number;
}

export interface LiveGamePlayResult
{
	type: string;
	event: string;
	description: string;
	rbi: number;
}

export interface GameData
{
	game: Game;
	datetime: GameDateTime;
	status: GameStatus;
	teams: GameTeams;
	players: { [key: string]: Player };
	venue: Venue;
	weather: GameWeather;
	review: GameReview;
	flags: GameFlags;
	alerts: any[];
	probablePitchers: GameProbablePitchers;
}

export interface GameProbablePitchers
{
	away: AbstractFullnameIdLink;
	home: AbstractFullnameIdLink;
}

export interface AbstractFullnameIdLink extends AbstractIdLink
{
	fullName: string;
}

export interface GameFlags
{
	noHitter: boolean;
	perfectGame: boolean;
}

export interface GameReview
{
	hasChallenges: boolean;
	away: TeamChallenges;
	home: TeamChallenges;
}

export interface TeamChallenges
{
	used: number;
	remaining: number;
}

export interface GameWeather
{
	condition: string;
	temp: string;
	wind: string;
}

export interface Venue extends AbstractIdLinkName
{
	location: VenueLocation;
	timeZone: VenueTimezone;
}

export interface VenueLocation
{
	city: string;
	state: string;
	stateAbbrev: string;
}

export interface VenueTimezone
{
	id: string;
	offset: number;
	tz: string;
}

export interface Player extends AbstractIdLink
{
	fullName: string;
	firstName: string;
	lastName: string;
	primaryNumber: string;
	birthDate: string;
	currentAge: number;
	height: string;
	weight: number;
	active: boolean;
	primaryPosition: PlayerPosition;
	useName: string;
	middleName: string;
	boxscoreName: string;
	draftYear: number;
	batSide: CodeDescription;
	pitchHand: CodeDescription;
	nameFirstLast: string;
	nameSlug: string;
	firstLastName: string;
	lastFirstName: string;
	lastInitName: string;
	initLastName: string;
	fullFMLName: string;
	fullLFMName: string;
}

export interface PlayerListResponse
{
	people: PlayerWithStats[];
}

export interface PlayerWithStats extends Player
{
	stats: PlayerStats[];
}

export interface PlayerStats
{
	group: DisplayNameData;
	type: DisplayNameData;
	splits: StatsSplits[];
}

export interface StatsSplits
{
	league: AbstractIdLinkName;
	season: string;
	team: AbstractIdLinkName;
	stat: PlayerStatValues;
}

export interface PlayerStatValues
{
	atBats: number;
	avg: string;
	babip: string;
	baseOnBalls: number;
	caughtStealing: number;
	doubles: number;
	gamesPlayed: number;
	groundOuts: number;
	hitByPitch: number;
	hits: number;
	homeRuns: number;
	leftOnBase: number;
	obp: string;
	ops: string;
	plateAppearances: number;
	rbi: number;
	runs: number;
	sacBunts: number;
	sacFlies: number;
	slg: string;
	stolenBases: number;
	strikeOuts: number;
	triples: number;
}

export interface DisplayNameData
{
	displayName: string;
}

export interface CodeDescription
{
	code: string;
	description: string;
}

export interface PlayerPosition
{
	code: string;
	name: string;
	type: string;
	abbreviation: string;
}

export interface GameTeam
{
	id: number;
	name: string;
	link: string;
	venue: AbstractIdLinkName;
	teamCode: string;
	fileCode: string;
	abbreviation: string;
	teamName: string;
	locationName: string;
	firstYearOfPlay: string;
	division: AbstractIdLinkName;
	sport: AbstractIdLinkName;
	record: GameRecord;
	shortName: string;
	active: boolean;
}

export interface GameRecord
{
	gamesPlayed: number;
	wildCardGamesBack: string;
	leagueGamesBack: string;
	springLeagueGamesBack: string;
	sportGamesBack: string;
	divisionGamesBack: string;
	leagueRecord: LeagueRecord;
	divisionLeader: boolean;
	wins: number;
	losses: number;
}

export interface LeagueRecord
{
	wins: number;
	losses: number;
	pct: string;
}

export interface AbstractIdLinkName extends AbstractIdLink
{
	name: string;
}

export interface AbstractIdLink
{
	id: number;
	link: string;
}

export interface GameTeams
{
	home: GameTeam;
	away: GameTeam;
}

export interface GameStatus
{
	abstractGameState: string;
	codedGameState: string;
	detailedState: string;
	statusCode: string;
	abstractGameCode: string;
}

export interface Game
{
	pk: number;
	type: string;
	doubleHeader: StringBoolean;
	id: string;
	gamedayType: StringBoolean;
	tiebreaker: StringBoolean;
	gameNumber: number;
	season: string;
	seasonDisplay: string;
}

export interface GameDateTime
{
	dateTime: string;
	originalDate: string;
	dayNight: "day" | "night";
	time: string;
	ampm: string;
}
