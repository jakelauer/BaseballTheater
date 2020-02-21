import Internal_DataLoader from "./utils/internal_dataloader";
import Internal_DataLoaderNode from "./utils/internal_dataloadernode";
import {CompilationPlaylists, GameMedia, IHighlightSearchItem, LiveData, MediaItem, PlayerListResponse, VideoSearchResults, VideoSearchWithMetadata} from "../contract";
import moment from "moment";
import {ISchedule, IScheduleGameList, ITeamDetails} from "../contract/teamschedule";
import {Standings} from "../contract/standings";

export class MlbDataServer
{
	/**
	 * Creates a new data server
	 * @param {(url: string) => string} urlTransformer If you need to use a proxy, this will allow you to hit that URL instead, given the MLB.com url
	 */
	constructor(private readonly urlTransformer?: (url: string) => string)
	{
		if (urlTransformer)
		{
			Internal_DataLoader.transformUrl = urlTransformer;
		}
	}

	public async getLiveGame(gameId: number | string)
	{
		const liveGameUrl = `http://statsapi.mlb.com/api/v1.1/game/${gameId}/feed/live`;

		return await Internal_DataLoader.load<LiveData>(
			liveGameUrl,
			"liveGame"
		);
	}

	public async getLiveGameNode(gameId: number | string)
	{
		const liveGameUrl = `http://statsapi.mlb.com/api/v1.1/game/${gameId}/feed/live`;

		return await Internal_DataLoaderNode.load<LiveData>(
			liveGameUrl,
			"liveGame"
		);
	}

	public async getGameMedia(gameId: number | string)
	{
		const mediaUrl = `https://statsapi.mlb.com/api/v1/game/${gameId}/content?language=en`;

		return await Internal_DataLoader.load<GameMedia>(mediaUrl, "media");
	}

	public async getGameMediaNode(gameId: number | string)
	{
		const mediaUrl = `https://statsapi.mlb.com/api/v1/game/${gameId}/content?language=en`;

		return await Internal_DataLoaderNode.load<GameMedia>(mediaUrl, "media");
	}

	public async getPlayers(playerIds: number[], year: number = -1)
	{
		const fixedYear = year === -1 ? moment().year() : year;
		const baseUrl = "https://statsapi.mlb.com/api/v1/people?";
		const playersQuery = "personIds=" + playerIds.join("&personIds=");
		const suffix = `&hydrate=stats(group=hitting,type=season,season=${fixedYear},gameType=R)`;

		const fullUrl = `${baseUrl}${playersQuery}${suffix}`;
		return await Internal_DataLoader.load<PlayerListResponse>(
			fullUrl,
			"playerData"
		);
	}

	public async getScoreboard(date: moment.Moment)
	{
		const dateString = date.format("YYYY-MM-DD");
		const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1,51&date=${dateString}&gameTypes=E,S,R,A,F,D,L,W&hydrate=team(leaders(showOnPreview(leaderCategories=[homeRuns,runsBattedIn,battingAverage],statGroup=[pitching,hitting]))),linescore(matchup,runners),flags,liveLookin,review,broadcasts(all),decisions,person,probablePitcher,stats,homeRuns,previousPlay,game(content(media(featured,epg),summary),tickets),seriesStatus(useOverride=true)&useLatestGames=false&scheduleTypes=events,games&language=en&leagueIds=103,104,420`;
		return await Internal_DataLoader.load<IScheduleGameList>(
			url,
			"schedule" + dateString
		);
	}

	public async getScoreboardNode(date: moment.Moment)
	{
		const dateString = date.format("YYYY-MM-DD");
		const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1,51&date=${dateString}&gameTypes=E,S,R,A,F,D,L,W&hydrate=team(leaders(showOnPreview(leaderCategories=[homeRuns,runsBattedIn,battingAverage],statGroup=[pitching,hitting]))),linescore(matchup,runners),flags,liveLookin,review,broadcasts(all),decisions,person,probablePitcher,stats,homeRuns,previousPlay,game(content(media(featured,epg),summary),tickets),seriesStatus(useOverride=true)&useLatestGames=false&scheduleTypes=events,games&language=en&leagueIds=103,104,420`;
		return await Internal_DataLoaderNode.load<IScheduleGameList>(
			url,
			"schedule" + dateString
		);
	}

	public async getStandings(asOfDate: moment.Moment)
	{
		const date = asOfDate.format("YYYY-MM-DD");
		const url = `https://statsapi.mlb.com/api/v1/standings?leagueId=103,104&season=2019&date=${date}&standingsTypes=regularSeason,springTraining,firstHalf,secondHalf&hydrate=division,conference,sport,league,team(nextSchedule(team,gameType=[R,F,D,L,W,C],inclusive=false),previousSchedule(team,gameType=[R,F,D,L,W,C],inclusive=true))`;

		return await Internal_DataLoader.load<Standings>(
			url,
			"standings"
		)
	}

	public async getTeamSchedule(
		teamId: number,
		season: number = undefined
	)
	{
		const now = moment();

		const dateString = now.format("YYYY-MM-DD");
		season = !season ? now.year() : season;

		const url = `https://statsapi.mlb.com/api/v1/teams/${teamId}?hydrate=previousSchedule(date=${dateString},season=${season},limit=162,team,linescore(matchup),decisions,person),nextSchedule(date=${dateString},season=${season},limit=162,team,linescore(matchup,runners),decisions,person)`;
		return await Internal_DataLoader.load<ISchedule>(
			url,
			"schedule" + teamId
		);
	}

	public async getTeamDetails(teamId: number)
	{
		const url = `https://statsapi.mlb.com/api/v1/teams/${teamId}`;
		return await Internal_DataLoader.load<ITeamDetails>(
			url,
			"teamdetails" + teamId
		);
	}

	private searchPlaylistIso(playlist: string, page = 1, isNode = false)
	{
		const url = `https://www.mlb.com/data-service/en/search?page=${page}&sel=${playlist}-video-list&selCulture=en-us`;

		return new Promise<any>((resolve, reject) =>
		{
			const promise = isNode
				? Internal_DataLoaderNode.load<any>(url, "playlistSearch")
				: Internal_DataLoader.load<any>(url, "playlistSearch");

			promise
				.then(data =>
				{
					resolve(data);
				})
				.catch(error => reject(error));
		});
	}

	private searchPlaylist = (playlist: string, page = 1) => this.searchPlaylistIso(playlist, page, false);
	private searchPlaylistNode = (playlist: string, page = 1) => this.searchPlaylistIso(playlist, page, true);

	private searchTagIso(tag: string, page = 1, isNode = false)
	{
		const url = `https://www.mlb.com/data-service/en/search?tags.slug=${tag}&page=${page}`;

		return new Promise<any>((resolve, reject) =>
		{
			const promise = isNode
				? Internal_DataLoaderNode.load<any>(url, "videoTagSearch")
				: Internal_DataLoader.load<any>(url, "videoTagSearch");

			promise
				.then(data =>
				{
					resolve(data);
				})
				.catch(error => reject(error));
		});
	}

	private searchTag = (tag: string, page = 1) => this.searchTagIso(tag, page, false);
	private searchTagNode = (tag: string, page = 1) => this.searchTagIso(tag, page, true);

	public videoTagSearchIso(tag: string, page = 1, isNode = false): Promise<VideoSearchWithMetadata[]>
	{
		return this.searchTagIso(tag, page, isNode).then(json =>
		{
			const docs: VideoSearchResults[] = json.docs;
			const promises = docs.map(async item =>
			{
				const slug = item.slug;
				const videoDataUrl = `https://www.mlb.com/data-service/en/videos/${slug}`;
				console.log(videoDataUrl);

				const videoJson = isNode
					? await Internal_DataLoaderNode.load<MediaItem>(videoDataUrl)
					: await Internal_DataLoader.load<MediaItem>(videoDataUrl);

				return {
					metadata: item,
					video: videoJson
				} as VideoSearchWithMetadata;
			});

			return Promise.all(promises);
		});
	}

	public videoTagSearch = (tag: string, page = 1): Promise<VideoSearchWithMetadata[]> => this.videoTagSearchIso(tag, page, false);
	public videoTagSearchNode = (tag: string, page = 1): Promise<VideoSearchWithMetadata[]> => this.videoTagSearchIso(tag, page, true);

	private videoPlaylistSearchIso(tag: CompilationPlaylists, page = 1, isNode = false): Promise<VideoSearchWithMetadata[]>
	{
		return this.searchPlaylistIso(tag, page, isNode).then(json =>
		{
			const docs: VideoSearchResults[] = json.docs;
			const promises = docs.map(async item =>
			{
				const slug = item.slug;
				const videoDataUrl = `https://www.mlb.com/data-service/en/videos/${slug}`;
				console.log(videoDataUrl);

				const videoJson = isNode
					? await Internal_DataLoaderNode.load<MediaItem>(videoDataUrl)
					: await Internal_DataLoader.load<MediaItem>(videoDataUrl);

				return {
					metadata: item,
					video: videoJson
				};
			});

			return Promise.all(promises);
		});
	}

	public videoPlaylistSearchNode = (tag: CompilationPlaylists, page = 1) => this.videoPlaylistSearchIso(tag, page, true);
	public videoPlaylistSearch = (tag: CompilationPlaylists, page = 1) => this.videoPlaylistSearchIso(tag, page, false);

	public async videoLocalSearch(text: string, page = 0, gameIds?: string)
	{
		let url = `/api/search?text=${text}&page=${page}`;
		if (gameIds)
		{
			url += `&gameIds=${gameIds}`;
		}

		return await fetch(url).then(r => r.json()) as IHighlightSearchItem[];
	}
}