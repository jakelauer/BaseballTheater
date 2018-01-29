namespace Theater
{
	export interface IHighlightsCollection
	{
		highlights: IMediaList;
	}

	export interface IMediaList
	{
		media: IHighlight[];
	}
}