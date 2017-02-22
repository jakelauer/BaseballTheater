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
		thumbnails: IThumbnails;
		keywords: Keyword[];
		condensed: boolean;
		recap: boolean;

		isPlaying: boolean;
	}

	export interface IThumbnails
	{
		thumb: IThumb[];
	}

	export interface IThumb
	{
		__text: string;

	}

	export interface IUrl
	{
		type: string;
		__text: string;
	}
}