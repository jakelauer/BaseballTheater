namespace Theater.GameDetail
{
	export interface ILink
	{
		url: string;
		label: string;
	}

	export class HighlightUtility
	{
		public static getDefaultThumb(highlight: IHighlight)
		{
			const thumbFinal = highlight.thumbnails.thumb[1].__text;
			return thumbFinal.replace("http:", location.protocol);
		}

		public static getDefaultUrl(highlight: IHighlight)
		{
			const links = this.getLinks(highlight);

			const link1800 = links.find((value) =>
			{
				return !!value.url.match("1800K");
			});

			if (link1800)
			{
				return link1800.url;
			}

			return links[links.length - 1].url;
		}

		public static getLinks(highlight: IHighlight): ILink[]
		{
			const qkRegex = /(\d{4}K)/;
			const links = highlight.url;
			let q1200k: ILink = null;

			// For some reason, Safari doesn't like this particular 
			// variable when it's a 'let' when it's minified. 
			// ReSharper disable once VariableCanBeMadeLet
			for (var link of links)
			{
				const matches = link.__text.match(qkRegex);
				if (matches && matches.length > 0)
				{
					q1200k = {
						url: link.__text.replace("http:", location.protocol),
						label: "low"
					};
				}
			}

			const validLinks: ILink[] = [];

			if (q1200k !== null)
			{
				const q1800K = {
					url: q1200k.url.replace(qkRegex, "1800K").replace("http:", location.protocol),
					label: "mid"
				};

				const q2500K = {
					url: q1200k.url.replace(qkRegex, "2500K").replace("http:", location.protocol),
					label: "high"
				};

				validLinks.push(q1200k, q1800K, q2500K);
			}

			return validLinks;
		}
	}
}