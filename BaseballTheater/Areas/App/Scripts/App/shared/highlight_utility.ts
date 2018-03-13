namespace Theater
{
	enum HighlightThumbQuality
	{
		Low,
		Med,
		High,
	}

	export interface IHighlightDisplay
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
		private static getThumbQualities(highlight: IHighlight): { [key: number]: IThumb }
		{
			const thumbs = highlight.thumbnails.thumb ? highlight.thumbnails.thumb : ((highlight.thumbnails as any) as IThumb[]);

			const low = thumbs.filter(a =>
			{
				const thumbString = a.__text || (a as any) as string;
				return thumbString.endsWith("51.jpg");
			})[0] || thumbs[1];

			const med = thumbs.filter(a =>
			{
				const thumbString = a.__text || (a as any) as string;
				return thumbString.endsWith("49.jpg");
			})[0] || low;

			const high = thumbs.filter(a =>
			{
				const thumbString = a.__text || (a as any) as string;
				return thumbString.endsWith("48.jpg") || thumbString.endsWith("53.jpg");
			})[0] || low;

			return {
				0: low, 
				1: med, 
				2: high
			};
		}

		public static getDefaultThumb(highlight: IHighlight, quality: HighlightThumbQuality = HighlightThumbQuality.Med)
		{
			if (highlight && highlight.thumbnails)
			{
				const thumb = this.getThumbQualities(highlight)[quality];
				const thumbFinal = thumb.__text || (thumb as any) as string;
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
			const qkRegex = /(\d{4}k?\.)/i;
			const links = Utility.forceArray(highlight.url);
			let q1200k: ILink | null = null;
			let hasK = false;
			const dateBefore2013 = moment(highlight.date).year() < 2013;

			// For some reason, Safari doesn't like this particular 
			// variable when it's a 'let' when it's minified. 
			// ReSharper disable once VariableCanBeMadeLet
			for (var link of links)
			{
				const linkText = link.__text ? link.__text : (link as any) as string;

				const matches = linkText.match(qkRegex);

				if (matches && matches.length > 0)
				{
					hasK = !!matches[0].match(/k/i);

					q1200k = {
						url: linkText.replace("http:", location.protocol),
						label: "low"
					};
				}
			}

			const validLinks: ILink[] = [];

			if (q1200k !== null)
			{
				validLinks.push(q1200k);

				if (hasK && !dateBefore2013)
				{
					const q1800K = {
						url: q1200k.url.replace(qkRegex, `1800K.`).replace("http:", location.protocol),
						label: "mid"
					};

					const q2500K = {
						url: q1200k.url.replace(qkRegex, `2500K.`).replace("http:", location.protocol),
						label: "high"
					};

					validLinks.push(q1800K, q2500K);
				}
			}

			return validLinks;
		}

		public static getDisplayProps(highlight: IHighlight, hideScores: boolean, searchResult?: IHighlightSearchResult | null): IHighlightDisplay | null
		{
			let displayProps: IHighlightDisplay | null = {
				thumb: "",
				links: [],
				videoUrl: "",
				overrideTitle: null,
				headline: "",
				teamId: ""
			}

			if (searchResult)
			{
				displayProps.thumb = searchResult.Thumbnails.High;
			}

			if (highlight)
			{
				displayProps.thumb = displayProps.thumb || HighlightUtility.getDefaultThumb(highlight);
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

				displayProps.headline = (highlight.recap && hideScores) ? "Recap" : highlight.headline;
			}
			else
			{
				displayProps = null;
			}

			return displayProps;
		}
	}
}