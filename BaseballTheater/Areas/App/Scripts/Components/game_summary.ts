namespace Theater.Site
{
	var linescoreItem = (realNumber: string) =>
	{
		return App.Instance.settingsVueData.hideScores ? "▨" : realNumber;
	};

	Vue.component("game-summary",
	{
		template: $("template#game-summary").html(),
		props: ["game"],
		methods: {
			getGameLink: (game: GameSummary) =>
			{
				const dayString = game.dateObj.format("YYYYMMDD");
				return `/game/${dayString}/${game.game_pk}`;
			},
			linescoreItem,
			getStatusTime: (game: GameSummary) =>
			{
				//var eventTimeString = string.Format("{0}{1} {2}", game.EventTime, game.EventTimeAmPm, game.TimeZone);
				var eventTime = game.time;
				var ampm = game.ampm;
				var timezone = game.time_zone;

				return `${eventTime}${ampm} ${timezone}`;
			},
			getInningCount: (game: GameSummary) =>
			{
				return Math.max(game.linescore.inning.length - game.linescore.startingInning, 9);
			},
			getLinescoreItem: (game: GameSummary, inningIndex: number, homeOrAway: string) =>
			{
				let realInningIndex = inningIndex + game.linescore.startingInning;

				let emptyInning = {
					home: "",
					away: ""
				};

				let inning: IInning = (emptyInning as any) as IInning;
				

				if (game.linescore && game.linescore.inning && game.linescore.inning.length > realInningIndex)
				{
					inning = game.linescore.inning[realInningIndex];
				}

				let homeInningText = game.status.status === "Final"
					? inning.home || "▨"
					: inning.home;

				return homeOrAway === "home"
					? linescoreItem(homeInningText)
					: linescoreItem(inning.away);
			},
			getLinescoreLabel: (game: GameSummary, inningIndex: number) =>
			{
				let realInningIndex = inningIndex + game.linescore.startingInning;

				return realInningIndex;
			}
		}
	});
}