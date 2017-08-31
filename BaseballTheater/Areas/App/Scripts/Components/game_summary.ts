namespace Theater.Site
{
	var linescoreItem = (realNumber: string) =>
	{
		return App.Instance.settingsVueData.hideScores ? "▨" : realNumber;
	};

	var getStatusTime = (game: GameSummary) =>
	{
		var time = game.dateObj.local().format("h:mm a");
		var timeZone = moment.tz(0, moment.tz.guess()).zoneAbbr();

		return `${time} ${timeZone}`;
	};

	Vue.component("game-summary", {
		template: $("template#game-summary").html(),
		props: ["game"],
		methods: {
			getGameLink: (game: GameSummary) =>
			{
				const dayString = game.dateObj.local().format("YYYYMMDD");
				return `/game/${dayString}/${game.game_pk}`;
			},
			linescoreItem,
			getStatusTime: (game: GameSummary) =>
			{
				var time = game.dateObj.local().format("h:mm a");
				var timeZone = moment.tz(0, moment.tz.guess()).zoneAbbr();

				return `${time} ${timeZone}`;
			},
			getInningCount: (game: GameSummary) =>
			{
				return Math.max(game.linescore.inning.length - game.linescore.startingInning, 9);
			},
			getLinescoreItem: (game: GameSummary, inningIndex: number, homeOrAway: string) =>
			{
				const realInningIndex = inningIndex + game.linescore.startingInning;

				const emptyInning = {
					home: "",
					away: ""
				};

				let inning: IInning = (emptyInning as any) as IInning;


				if (game.linescore && game.linescore.inning && game.linescore.inning.length > realInningIndex)
				{
					inning = game.linescore.inning[realInningIndex];
				}

				const homeInningText = game.status.status === "Final"
					? inning.home || "▨"
					: inning.home;

				return homeOrAway === "home"
					? linescoreItem(homeInningText)
					: linescoreItem(inning.away);
			},
			getLinescoreLabel: (game: GameSummary, inningIndex: number) =>
			{
				const realInningIndex = inningIndex + game.linescore.startingInning;

				return realInningIndex;
			}
		}
	});

	type WinnerOptions = "none" | "home" | "away";
	Vue.component("game-summary-simple",
		{
			template: $("template#game-summary-simple").html(),
			props: ["game"],
			methods: {
				linescoreItem,
				getWinner: (game: GameSummary): WinnerOptions =>
				{
					let winner: WinnerOptions = "none";
					if (game.linescore && !App.Instance.settingsVueData.hideScores)
					{
						const away = Number(game.linescore.r.away) > Number(game.linescore.r.home);
						winner = away ? "away" : "home";
					}
					return winner;
				},
				getGameLink: (game: GameSummary) =>
				{
					const dayString = game.dateObjEst.format("YYYYMMDD");
					return `/game/${dayString}/${game.game_pk}`;
				},
				getTopPlaysCount: (game: GameSummary) =>
				{
					let topPlays = 0;
					if (game.topPlayHighlights)
					{
						for (let media of game.topPlayHighlights)
						{
							topPlays += media["top-play"] === "true" ? 1 : 0;
						}
					}
					return topPlays;
				},
				getCurrentInning: (game: GameSummary) =>
				{
					if (game.status.ind === "F")
					{
						return game.status.status;
					}

					if (game.status.reason)
					{
						return `${game.status.status} (${game.status.reason})`;
					}
					
					return game.status.inning_state
						? `${game.status.inning_state} ${game.status.inning}`
						: getStatusTime(game);
				},
				getStatusTime: (game: GameSummary) => { return getStatusTime(game) },
			}
		});
}