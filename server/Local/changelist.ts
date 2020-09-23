export const changelist: { [datetime: string]: string[] } = {
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