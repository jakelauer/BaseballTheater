namespace Theater
{
	interface IHighlightDisplay
	{
		thumb: string | null;
		links: ILink[];
		videoUrl: string;
		teamId: string;
		headline: string;
		overrideTitle: string | null;
	}

	export interface ILink
	{
		url: string;
		label: string;
	}

	export class HighlightUtility
	{
		public static getDefaultThumb(highlight: IHighlight)
		{
			if (highlight && highlight.thumbnails)
			{
				const thumbs = highlight.thumbnails.thumb ? highlight.thumbnails.thumb : ((highlight.thumbnails as any) as IThumb[]);
				const thumbFinal = thumbs[1].__text || (thumbs[1] as any) as string;
				return thumbFinal.replace("http:", location.protocol);
			}

			return "";
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
			const links = (highlight.url instanceof Array) ? highlight.url : [(highlight.url as any) as IUrl];
			let q1200k: ILink | null = null;

			// For some reason, Safari doesn't like this particular 
			// variable when it's a 'let' when it's minified. 
			// ReSharper disable once VariableCanBeMadeLet
			for (var link of links)
			{
				const linkText = link.__text ? link.__text : (link as any) as string;

				const matches = linkText.match(qkRegex);

				if (matches && matches.length > 0)
				{
					q1200k = {
						url: linkText.replace("http:", location.protocol),
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

		public static getDisplayProps(highlight: IHighlight): IHighlightDisplay | null
		{
			let displayProps: IHighlightDisplay | null = {
				thumb: "",
				links: [],
				videoUrl: "",
				overrideTitle: null,
				headline: "",
				teamId: ""
			}

			if (highlight)
			{
				displayProps.thumb = HighlightUtility.getDefaultThumb(highlight);
				displayProps.links = HighlightUtility.getLinks(highlight);
				displayProps.videoUrl = HighlightUtility.getDefaultUrl(highlight);
				displayProps.teamId = highlight.team_id;

				if (highlight.recap)
				{
					displayProps.overrideTitle = "Recap";
				}

				if (highlight.condensed)
				{
					displayProps.overrideTitle = "Condensed Game";
				}

				displayProps.headline = highlight.headline;
			}
			else
			{
				displayProps = null;
			}

			return displayProps;
		}
	}
}