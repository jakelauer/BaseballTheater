import {Keyword} from "./keyword";

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

export interface IHighlightThumbnails
{
	high: string;
	med: string;
	low: string;
}

export interface IHighlightSearchResult
{
	highlight: IHighlight;
	thumbnails: IHighlightThumbnails;
	gameId: number;
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

interface IKeywords
{
	keyword: Keyword[];
}
