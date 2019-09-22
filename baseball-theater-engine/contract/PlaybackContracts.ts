/**
 * @swagger
 * definitions:
 *    CompilationPlaylists:
 *      type: string
 *      enum:
 *       - key-moments-video-list
 *       - pitchers-who-rake-video-list
 *       - real-fast-video-list
 *       - cut4-video-list
 *       - baseball-bloopers-video-list
 *       - tip-of-the-cap-video-list
 */
export enum CompilationPlaylists
{
	KeyMoments = "key-moments-video-list",
	PitchersWhoRake = "pitchers-who-rake-video-list",
	RealFast = "real-fast-video-list",
	Cut4 = "cut4-video-list",
	Bloopers = "baseball-bloopers-video-list",
	TipOfTheCap = "tip-of-the-cap-video-list"
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
 */
export enum RecapTags
{
	PitchingHighlights = "highlight-reel-pitching",
	StartingPitchingHighlights = "highlight-reel-starting-pitching",
	OffenseHighlights = "highlight-reel-offense",
	CarryTheFreight = "carry-the-freight",
	ReliefPerformance = "relief-performance"
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
}

export enum NonPlayTags
{
	Interviews = "interview",
	InjuryNews = "injury",
}