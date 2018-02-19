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
		Id: number;
		Date: Date;
		TeamId: number;
		TeamName: string;
		PlayerIds: string;
		PlayerNames: string;

		Headline: string;
		Duration: string;
		Blurb: string;
		BigBlurb: string;
		Thumb_s: string;
		Thumb_m: string;
		Thumb_l: string;
		Video_s: string;
		Video_m: string;
		Video_l: string;
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