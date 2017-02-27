namespace Theater.Site
{
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
			lineScoreItem: (realNumber: string) =>
			{
				return App.Instance.settingsVueData.hideScores ? "▨" : realNumber;
			},
			getStatusTime: (game: GameSummary) =>
			{
				//var eventTimeString = string.Format("{0}{1} {2}", game.EventTime, game.EventTimeAmPm, game.TimeZone);
				var eventTime = game.time;
				var ampm = game.ampm;
				var timezone = game.time_zone;

				return `${eventTime}${ampm} ${timezone}`;
			}
		}
	});
}