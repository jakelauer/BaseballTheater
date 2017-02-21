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
			}
		}
	});
}