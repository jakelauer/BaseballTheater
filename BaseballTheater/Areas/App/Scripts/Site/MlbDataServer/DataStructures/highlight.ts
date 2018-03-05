// ReSharper disable InconsistentNaming
namespace Theater
{
	export interface IHighlight
	{
		type: string;
		id: number;
		team_id: string;
		date: Date;
		headline: string;
		blurb: string;
		bigblurb: string;
		duration: string;
		url: IUrl[];
		thumb: IUrl;
		thumbnails: IThumbnails;
		keywords: IKeywords;
		condensed: boolean;
		recap: boolean;
		"top-play": string;

		isPlaying: boolean;
	}
	
	export interface IHighlightSearchResult
	{
		Highlight: IHighlight;
		GameId: number;
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

	export interface IKeywords
	{
		keyword: Keyword[];
	}
}