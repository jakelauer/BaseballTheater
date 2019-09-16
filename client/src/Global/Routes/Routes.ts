import pathToRegexp, {PathFunction} from "path-to-regexp";
import {ITeams} from "baseball-theater-engine/dist";
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

export interface IGameParams
{
	gameId: string,
	tab?: "Wrap" | "LiveGame" | "BoxScore" | "Highlights";
}

export class SiteRoutes
{
	public static Games = new SiteRoute<{ yyyymmdd?: string }>("/games/:yyyymmdd?");
	public static Game = new SiteRoute<IGameParams>("/game/:gameId/:tab?", {tab: "Highlights"});
	public static Schedule = new SiteRoute<{ year: string; team?: string }>("/schedule/:year/:team?", {
		year: moment().format("YYYY")
	});
	public static Standings = new SiteRoute<{ year: string; }>("/standings/:year", {
		year: moment().format("YYYY")
	});
	public static FeaturedVideos = new SiteRoute("/videos");
	public static Teams = new SiteRoute("/teams");
	public static Team = new SiteRoute<{ team: keyof ITeams }>("/team/:team");
}