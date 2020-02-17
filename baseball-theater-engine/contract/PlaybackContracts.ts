/**
 * @swagger
 * definitions:
 *    CompilationPlaylists:
 *      type: string
 *      enum:
 *       - key-moments
 *       - pitchers-who-rake
 *       - real-fast
 *       - cut4
 *       - baseball-bloopers
 *       - tip-of-the-cap
 *       - fastcast
 *       - clinches-and-celebrations
 *       - home-runs
 */
export enum CompilationPlaylists
{
	KeyMoments = "key-moments",
	PitchersWhoRake = "pitchers-who-rake",
	RealFast = "real-fast",
	Cut4 = "cut4",
	Bloopers = "baseball-bloopers",
	TipOfTheCap = "tip-of-the-cap",
	FastCast = "fastcast",
	ClinchesAndCelebrations = "clinches-and-celebrations",
	HomeRuns = "home-runs"
}

/**
 * @swagger
 * definitions:
 *    RecapTags:
 *      type: string
 *      enum:
 *       - highlight-reel-pitching
 *       - highlight-reel-starting-pitching
 *       - highlight-reel-offense
 *       - carry-the-freight
 *       - relief-performance
 *       - fast-cast
 *       - business-of-baseball
 *       - mlbn-rundown
 *       - player-of-the-week
 *       - clincher
 *       - quality-start
 *       - best-performer
 *       - rivalry
 */
export enum RecapTags
{
	PitchingHighlights = "highlight-reel-pitching",
	StartingPitchingHighlights = "highlight-reel-starting-pitching",
	OffenseHighlights = "highlight-reel-offense",
	CarryTheFreight = "carry-the-freight",
	ReliefPerformance = "relief-performance",
	FastCast = "fast-cast",
	BusinessOfBaseball = "business-of-baseball",
	MLBNetworkRundown = "mlbn-rundown",
	PlayerOfTheWeek = "player-of-the-week",
	Clincher = "clincher",
	QualityStart = "quality-start",
	BestPerformer = "best-performer",
	Rivalry = "rivalry"
}

/**
 * @swagger
 * definitions:
 *    SinglePlayTags:
 *      type: string
 *      enum:
 *       - defense
 *       - offense
 *       - home-run
 *       - replay
 *       - challenge
 *       - high-speed-play
 *       - clutch-moment
 *       - must-c
 *       - player-tracking
 *       - filthy-pitch
 *       - walk-off
 *       - extra-innings
 *       - grand-slam
 *       - milestone
 *       - pitchers-hitting-hr
 *       - double-play
 *       - triple-play
 *       - career-first
 *       - key-moments
 */
export enum SinglePlayTags
{
	Defense = "defense",
	Offense = "offense",
	HomeRuns = "home-run",
	Replays = "replay",
	Challenges = "challenge",
	HighSpeed = "high-speed-play",
	ClutchMoment = "clutch-moment",
	MustC = "must-c",
	Statcast = "player-tracking",
	FilthyPitches = "filthy-pitch",
	WalkOff = "walk-off",
	ExtraInnings = "extra-innings",
	GrandSlam = "grand-slam",
	Milestone = "milestone",
	PitcherHomeRuns = "pitchers-hitting-hr",
	DoublePlay = "double-play",
	TriplePlay = "triple-play",
	CareerFirst = "career-first",
	KeyMoments = "key-moments"
}

/**
 * @swagger
 * definitions:
 *    NonPlayTags:
 *      type: string
 *      enum:
 *       - interview
 *       - injury
 *       - broadcasters
 *       - ceremonial-first-pitch
 */
export enum NonPlayTags
{
	Interviews = "interview",
	InjuryNews = "injury",
	Broadcasters = "broadcasters",
	CeremonialFirstPitch = "ceremonial-first-pitch"
}