namespace Theater
{
	interface ILink
	{
		url: string;
		label: string;
	}

	Vue.component("highlight",
		{
			template: $("template#highlight").html(),
			props: ["highlight"],
			methods: {
				getLinks: (highlight: IHighlight) => HighlightModule.getLinks(highlight),
				getDefaultUrl: (highlight: IHighlight) => HighlightModule.getDefaultUrl(highlight),
				getTitle: (highlight: IHighlight) => HighlightModule.getTitle(highlight),
				getDefaultThumb: (highlight: IHighlight) => HighlightModule.getDefaultThumb(highlight),
				getMlbLink: (highlight: IHighlight) => HighlightModule.getMlbLink(highlight),
				showMlbFrame: (highlight: IHighlight) => HighlightModule.showMlbFrame(highlight)
			}
		});

	module HighlightModule
	{
		export function getDefaultUrl(highlight: IHighlight)
		{
			const links = getLinks(highlight);

			return links[0].url;
		}

		export function getLinks(game: IHighlight)
		{
			const qkRegex = /(\d{4}K)/;
			const links = game.url;
			let q1200k: ILink = null;

			// For some reason, Safari doesn't like this particular 
			// variable when it's a 'let' when it's minified. 
			// ReSharper disable once VariableCanBeMadeLet
			for (var link of links)
			{
				const matches = link.__text.match(qkRegex);
				if (matches && matches.length > 0)
				{
					const label = matches[0] as string;
					q1200k = {
						url: link.__text.replace("http:", location.protocol),
						label: label
					};
				}
			}

			const validLinks: ILink[] = [];

			if (q1200k !== null)
			{
				const q1800K = {
					url: q1200k.url.replace(qkRegex, "1800K").replace("http:", location.protocol),
					label: "1800K"
				};

				const q2500K = {
					url: q1200k.url.replace(qkRegex, "2500K").replace("http:", location.protocol),
					label: "2500K"
				};

				validLinks.push(q1200k, q1800K, q2500K);
			}

			return validLinks;
		}


		export function getTitle(highlight: IHighlight)
		{
			return highlight.recap && App.Instance.settingsVueData.hideScores
				? "Recap (score hidden)"
				: highlight.headline;
		}

		export function showMlbFrame(highlight: IHighlight)
		{
			const iframeSrc = getMlbLink(highlight);

			const iframeHtml = `
<iframe src='${iframeSrc}' width="100%" height="100%" frameborder="0" scrolling="no"/>
			`;
			
			const modal = new Modal("mlb-video", iframeHtml);
			modal.open();
		}

		export function getMlbLink(highlight: IHighlight)
		{
			/*var $playCover = $(event.currentTarget);
			var $video = $playCover.siblings("video");
			($video[0] as HTMLVideoElement).play();*/

			const cId = highlight.id;
			const mlbLink = `https://www.mlb.com/video/c-${cId}`;
			return mlbLink;
		}

		export function getDefaultThumb(highlight: IHighlight)
		{
			let thumbFinal: string = highlight.thumb;
			if (highlight.thumbnails != null && highlight.thumbnails.thumb != null && highlight.thumbnails.thumb.length > 0)
			{
				const thumbs = highlight.thumbnails.thumb;

				if (App.clientNetSpeed !== NetSpeed.Fast)
				{
					let jpgSearch = "47.jpg";

					if (App.clientNetSpeed === NetSpeed.Slow)
					{
						jpgSearch = "52.jpg";
					}

					for (let thumb of thumbs)
					{
						if (Utility.endsWith(thumb.__text, jpgSearch))
						{
							thumbFinal = thumb.__text;
						}
					}
				}

				thumbFinal = thumbs[thumbs.length - 2].__text;
			}

			return thumbFinal.replace("http:", location.protocol);
		}
	}
}