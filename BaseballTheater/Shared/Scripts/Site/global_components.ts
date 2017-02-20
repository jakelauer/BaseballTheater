namespace Theater.Site
{
	export class GlobalComponents
	{
		public static registerComponents()
		{
			Vue.component("game-summary", {
				template: $("template#game-summary").html(),
				props: ["game"],
				methods: {
					getGameLink: (game: GameSummary) =>
					{
						let dayString = game.dateObj.format("YYYYMMDD");
						return `/game/${dayString}/${game.game_pk}`;
					}
				}
			});
		}
	}
}