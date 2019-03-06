// https://statsapi.mlb.com/api/v1/game/530482/content?language=en

interface GameMedia
{
	editorial: GameMediaEditorial;
	highlights: GameMediaHighlightsWrapper;
	summary: any;
	gameNotes: any;
	media: GameMediaMedia;
}

interface GameMediaMedia
{
	enhancedGame: boolean;
	epg: GameMediaMediaEpg[]
}

interface GameMediaMediaEpg
{
	items: MediaItem[];
	title: string;
}

interface GameMediaHighlightsWrapper
{
	highlights: GameMediaHighlights;
}

interface GameMediaHighlights
{
	type: string;
	items: MediaItem[];
	live: MediaItem[];
	scoreboardPreview: { items: MediaItem[] };
}

interface GameMediaEditorial
{
	recap: HomeAwayMlbArticles;
	wrap: HomeAwayMlbArticles;
}

interface HomeAwayMlbArticles
{
	home: GameMediaArticle;
	away: GameMediaArticle;
	mlb: GameMediaArticle;
}

interface GameMediaArticle extends GameMediaBase
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

interface GameMediaBase
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

interface MediaItem extends GameMediaBase
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

interface MediaItemPlayback
{
	name: string;
	width: string;
	height: string;
	url: string;
}

interface ArticleImage
{
	title: string;
	altText: string;
	cuts: ArticleImageOfSize[];
}

interface ArticleImageOfSize
{
	aspectRatio: string;
	width: number;
	height: number;
	src: string;
	at2x: string;
	at3x: string;
}

interface ContributorWrapper
{
	contributors: Contributor[]
	source: string;
	image: string;
}

interface Contributor
{
	name: string;
	source: string;
	tagline: string;
	twitter: string;
}

interface Keyword
{
	type: string;
	value: string;
	displayName: string;
}