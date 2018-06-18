import {Utility} from "@Utility/index";
import {IHighlight} from "./highlight";

export interface IHighlightsCollection
{
	highlights: IMediaList;
}

export interface IMediaList
{
	media: IHighlight[];
}

export class HighlightsCollection implements IHighlightsCollection
{
	public highlights: IMediaList;
	
	constructor(private hcData: IHighlightsCollection)
	{
		this.highlights = this.hcData.highlights;
		
		this.highlights.media = Utility.Data.forceArray(this.hcData.highlights.media);
	}
}