namespace Theater
{
	export interface IHighlight
	{
		type: string;
		id: number;
		date: Date;
		headline: string;
		blurb: string;
		duration: string;
		url: IUrl[];
		thumb: string;
		thumbnails: IThumb[];
		keywords: Keyword[];
		condensed: boolean;
		recap: boolean;
	}

	export interface IThumb
	{
		__text: string;
	}

	export interface IUrl
	{
		__text: string;
	}
}