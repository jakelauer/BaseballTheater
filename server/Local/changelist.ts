export const changelist: { [datetime: string]: string[] } = {
	["2020-10-01"]: [
		"Added baserunners to Live Play",
		"Fixed wonky icon sizes in game view"
	],
	["2020-09-30"]: [
		"Added live plays tab for the current half inning, which auto-updates (every 10 seconds for subscribers, 30 seconds otherwise)",
		"Made strikezone and pitch locations more accurate",
		"Added update timer bar for currently live games (hide in settings)",
		"Bug fixes and style improvements"
	],
	["2020-09-23"]: [
		"Sorted highlights by date (so they should match the order they happened in the game)",
		`Added the following to each play: \n- exit velocity\n- launch angle\n- hit distance\n- hit hardness\n- hit type\n- pitch start/end speed`
	],
	["2020-09-18"]: [
		"Fixed an bug where a message saying no videos were available... above the videos that were available"
	],
	["2020-09-15"]: [
		"Added non-play events to the plays list",
		"Added current pitcher to play items",
		"Improved messages when no items are present in highlights or plays"
	],
	["2020-09-13"]: [
		"[Pro Backers] Chromecast support! This is available for Pro Backers and above. You can cast all highlights to any device that supports it!",
		"Plays tab now lets you choose between Scoring Plays and All Plays",
		"Added game decisions (winning/losing pitcher, saves) in the game list",
		"Added No Hitter and Perfect Game labels to games (only visible if Hide Scores is disabled)",
		"More understandable video button labels",
		"Added video durations to video descriptions",
		"Fixed a bug that caused batting orders to be incorrect",
	]
};