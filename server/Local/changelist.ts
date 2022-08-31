export const changelist: { [datetime: string]: string[] } =
	{
		["2022-08-31"]: [
			"Added back button to game detail",
			"Fix for search shortcuts at the top of the game list",
			"Remove auto-redirect at root URL",
			"Show probable pitcher record and ERA",
			"Fix for Plays tab so it default to the current inning instead of being blank"
		],
		["2022-08-29"]: [
			"Fix for Patreon login not working correct (service worker path blacklist needed to be reconfigured)"
		],
		["2022-08-27"]: [
			"Fix for issue with back button not working in game details"
		],
		["2022-08-17"]: [
			"Fix for video tab not loading initially",
			"Sometimes MLB removes videos from game data after a few weeks. I'm not sure why this happens. For those times, I've added a fallback option that loads videos from another source.",
			"General bug fixes and performance improvements"
		]
	};