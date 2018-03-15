import {IHighlight} from "./highlight";

export interface IHighlightsCollection
{
	highlights: IMediaList;
}

export interface IMediaList
{
	media: IHighlight[];
}
