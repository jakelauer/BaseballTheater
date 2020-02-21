// https://statsapi.mlb.com/api/v1/game/530482/content?language=en

export interface GameMedia
{
	editorial: GameMediaEditorial;
	highlights: GameMediaHighlightsWrapper;
	summary: any;
	gameNotes: any;
	media: GameMediaMedia;
}

export interface GameMediaMedia
{
	enhancedGame: boolean;
	epg: GameMediaMediaEpg[];
}

export interface GameMediaMediaEpg
{
	items: MediaItem[];
	title: string;
}

export interface GameMediaHighlightsWrapper
{
	highlights: GameMediaHighlights;
}

export interface GameMediaHighlights
{
	type: string;
	items: MediaItem[];
	live: MediaItem[];
	scoreboardPreview: { items: MediaItem[] };
}

export interface GameMediaEditorial
{
	recap: HomeAwayMlbArticles;
	wrap: HomeAwayMlbArticles;
}

export interface HomeAwayMlbArticles
{
	home: GameMediaArticle;
	away: GameMediaArticle;
	mlb: GameMediaArticle;
}

export interface GameMediaArticle extends GameMediaBase
{
	subhead: string;
	seoKeywords: string;
	seoDescription: string;
	photo: ArticleImage;
	body: string;
	contributor: ContributorWrapper;
	canonical: string;
	media: MediaItem[];
}

export interface GameMediaBase
{
	type: "article" | "video";
	state: string;
	date: string;
	id: string;
	headline: string;
	seoTitle: string;
	slug: string;
	image: ArticleImage;
	blurb: string;
	keywordsAll: Keyword[];
}

export interface MediaItem extends GameMediaBase
{
	topic_id: string;
	noIndex: boolean;
	mediaPlaybackId: string;
	title: string;
	kicker: string;
	description: string;
	duration: string;
	language: "en" | "es";
	guid: string;
	mediaState: string;
	playbacks: MediaItemPlayback[];
}

export interface MediaItemPlayback
{
	name: string;
	width: string;
	height: string;
	url: string;
}

export interface ArticleImage
{
	title: string;
	altText: string;
	cuts: ArticleImageOfSize[];
}

export interface ArticleImageOfSize
{
	aspectRatio: string;
	width: number;
	height: number;
	src: string;
	at2x: string;
	at3x: string;
}

export interface ContributorWrapper
{
	contributors: Contributor[];
	source: string;
	image: string;
}

export interface Contributor
{
	name: string;
	source: string;
	tagline: string;
	twitter: string;
}

export interface Keyword
{
	type: string;
	value: string;
	slug: string;
	displayName: string;
}

export interface VideoSearch
{
	meta: {
		page_size: number;
		offset: number;
		moreResults: boolean;
	}
	docs: MediaDoc[];
}

export interface MediaDoc
{
	id: string;
	content_id: string;
	slug: string;
	title: string;
	type: string;
	lastPublish: string;
	blurb: string;
	description: string;
	duration: string;
	url: string;
	mediaPlaybackId: string;
	source: string;
	createdOn: string;
	date: string;
	kicker: string;
	keywordsDisplay: Keyword[];
	keywordsAll: Keyword[];
	image: ArticleImage;
	playbacks: MediaItemPlayback[];
}

export interface IHighlightSearchItem
{
	highlight: MediaItem;
	game_pk: number;
}
