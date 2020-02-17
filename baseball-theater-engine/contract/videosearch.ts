import {ArticleImage, MediaItem} from "./media";
import {Keyword} from "./keyword";

export interface VideoSearchResults
{
	date: string;
	blurb: string;
	duration: string;
	id: string;
	slug: string;
	title: string;
	image: ArticleImage;
	keywordsDisplay: Keyword[];
	language: string;
	seoTitle: string;
}

export interface VideoSearchWithMetadata
{
	metadata: VideoSearchResults;
	video: MediaItem;
}
