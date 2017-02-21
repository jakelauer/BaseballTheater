namespace Theater.Site
{
	interface ILink
	{
		url: string;
		label: string;
	}
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

			Vue.component("highlight", {
				template: $("template#highlight").html(),
				props: ["highlight"],
				methods: {
					getLinks: (game: IHighlight) =>
					{
						var links = game.url;
						var validLinks: ILink[] = [];
						for (var link of links)
						{
							var matches = link.__text.match(/(\d{4}K)/);
							if (matches && matches.length > 0)
							{
								var label = matches[0] as string;

								validLinks.push({
									url: link.__text,
									label: label
								});
							}
						}
						return validLinks;
					},
					getDefaultUrl: (highlight: IHighlight) =>
					{
					},
					getDefaultThumb: (highlight: IHighlight) =>
					{
						return highlight.thumbnails != null && highlight.thumbnails.length > 0
									? highlight.thumbnails[highlight.thumbnails.length - 1]
									: highlight.thumb;
					}
				}
			});
		}
	}
}