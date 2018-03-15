import {BoxScoreData, IBoxScoreContainer, IGameCenter, IGameSummaryData, IHighlightsCollection, IInningsContainer, Innings, LiveData} from "./Contracts";
import {DataLoader} from "./Utils/data_loader";

export class GameDetailCreator
{
	private static readonly urlBase = "http://gd2.mlb.com";

	private readonly directoryUrl: string;
	private readonly highlightsUrl: string;
	private readonly gameCenterUrl: string;
	private readonly boxScoreUrl: string;
	private readonly inningsUrl: string;
	private readonly gameSummaryUrl: string;
	private readonly liveGameUrl: string;

	public constructor(directory: string, directoryIsFullyQualified = false)
	{
		this.directoryUrl = directoryIsFullyQualified
			? directory
			: GameDetailCreator.urlBase + directory;

		this.highlightsUrl = this.directoryUrl + "/media/mobile.xml";
		this.gameCenterUrl = this.directoryUrl + "/gamecenter.xml";
		this.gameSummaryUrl = this.directoryUrl + "/linescore.xml";
		this.boxScoreUrl = this.directoryUrl + "/boxscore.xml";
		this.inningsUrl = this.directoryUrl + "/inning/inning_all.xml";
	}

	public async getHighlights()
	{
		const highlightsCollection = await DataLoader.loadXml<IHighlightsCollection>(this.highlightsUrl, "highlightsCollection");

		return highlightsCollection;
	}

	public async getGameCenter()
	{
		const gameCenterObj = await DataLoader.loadXml<IGameCenter>(this.gameCenterUrl, "gameCenter");

		return gameCenterObj;
	}

	public async getGameSummary()
	{
		const gameSummaryObj = await DataLoader.loadXml<IGameSummaryData>(this.gameSummaryUrl, "gameSummary");

		return gameSummaryObj;
	}

	public async getBoxscore()
	{
		const boxScoreObj = await DataLoader.loadXml<IBoxScoreContainer>(this.boxScoreUrl, "boxScore");

		return new BoxScoreData(boxScoreObj);
	}

	public async getLiveGame(gameId: number | string)
	{
		const liveGameUrl = `http://statsapi.mlb.com/api/v1.1/game/${gameId}/feed/live`;

		const liveObj = await DataLoader.loadJson<LiveData>(liveGameUrl, "liveGame");

		return liveObj;
	}

	/**
	 * Gets the play-by-play for the game in question.
	 * @param boxScore Required to get information about players when they are only specified by ID
	 */
	public async getInnings(boxScore: BoxScoreData)
	{
		const inningsObj = await DataLoader.loadXml<IInningsContainer>(this.inningsUrl, "innings");

		return new Innings(inningsObj, boxScore);
	}

	private static async get<T>(url: string)
	{
		try
		{
			return await DataLoader.loadXml<T>(url);
		}
		catch (e)
		{
			GameDetailCreator.handleError(e);
		}
	}

	private static handleError(e: Error)
	{
		console.error(e);
	}
}
