export const changelist: { [datetime: string]: string[] } = {
	["2020-10-14"]: [
		"Highlight search upgrade! Search is faster, and includes highlights going all the way back to 2016.",
		"User settings reset - this is a side effect of a database upgrade.",
	],
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
};