import pathToRegexp, {PathFunction} from "path-to-regexp";
import {ITeams} from "baseball-theater-engine";
import moment from "moment";

export class SiteRoute<T extends object = {}>
{
	private compiler: PathFunction<T>;

	constructor(private readonly baseRoute: string, private readonly defaults?: Partial<T>)
	{
		this.compiler = pathToRegexp.compile(baseRoute)
	}

	public get path()
	{
		return this.baseRoute;
	}

	public resolve(params?: T)
	{
		const paramsWithDefaults = {...this.defaults, ...params};
		return this.compiler(paramsWithDefaults);
	}
}

export type GameTabs = "Wrap" | "LiveGame" | "BoxScore" | "Highlights";
export interface IGameParams
{
	gameDate?: string;
	gameId: string,
	tab?: GameTabs;
}


export class SiteRoutes
{
	public static Games = new SiteRoute<{ yyyymmdd?: string }>("/games/:yyyymmdd?");
	public static Game = new SiteRoute<IGameParams>("/game/:gameDate/:gameId/:tab?", {gameDate: "_"});
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
	public static Search = new SiteRoute<{ query?: string, gameIds?: string }>("/search/:query?/:gameIds?");
}