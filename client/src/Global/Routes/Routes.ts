import { ITeams } from 'baseball-theater-engine';
import moment from 'moment';
import { compile, PathFunction } from 'path-to-regexp';

export class SiteRoute<T extends object = {}>
{
	private compiler: PathFunction<T>;

	constructor(private readonly baseRoute: string, private readonly defaults?: Partial<T>)
	{
		this.compiler = compile(baseRoute)
	}

	public get path()
	{
		return this.baseRoute;
	}

	public resolve(params: T)
	{
		const paramsWithDefaults = {...this.defaults, ...params};
		return this.compiler(paramsWithDefaults);
	}
}

export type GameTabs = "Wrap" | "LiveGame" | "BoxScore" | "Highlights" | "Plays";
export type IGameParams = 
{
	gameDate?: string;
	gameId: string,
}

export type IGameTabParams = 
{
	gameDate?: string;
	gameId: string,
	tab: GameTabs;
}

export type IGameTabDetailParams = 
{
	gameDate?: string;
	gameId: string,
	tab: GameTabs;
	tabDetail: string;
}


export class SiteRoutes
{
	public static GamesRoot = new SiteRoute<{ yyyymmdd?: string }>("/games");
	public static Games = new SiteRoute<{ yyyymmdd?: string }>("/games/:yyyymmdd");
	public static Game = new SiteRoute<IGameParams>("/game/:gameDate/:gameId", {gameDate: "_"});
	public static GameTab = new SiteRoute<IGameTabParams>("/game/:gameDate/:gameId/:tab", {gameDate: "_"});
	public static GameTabDetail = new SiteRoute<IGameTabDetailParams>("/game/:gameDate/:gameId/:tab/:tabDetail", {gameDate: "_"});
	public static Schedule = new SiteRoute<{ year: string; team?: string }>("/schedule/:year/:team?", {
		year: moment().format("YYYY")
	});
	public static Standings = new SiteRoute<{ year: string; }>("/standings/:year", {
		year: moment().format("YYYY")
	});
	public static FeaturedVideos = new SiteRoute<{ category: string, tag?: string }>("/videos/:category/:tag?");
	public static Teams = new SiteRoute("/team/:teamFileCode");
	public static Team = new SiteRoute<{ team: keyof ITeams }>("/team/:team");
	public static ApiTest = new SiteRoute("/apitest");
	public static Settings = new SiteRoute("/settings");
	public static Search = new SiteRoute<{ query?: string, date?: string }>("/search/:query?/:date?");
}