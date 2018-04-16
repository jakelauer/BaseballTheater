import {BoxScoreData, IBoxScoreContainer, IGameCenter, IGameSummaryData, IHighlightsCollection, IInningsContainer, Innings} from "./Contracts";
import Internal_DataLoader from "./Utils/Internal_DataLoader";

export default class Internal_GameDetailCreator
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
			: Internal_GameDetailCreator.urlBase + directory;

		this.highlightsUrl = this.directoryUrl + "/media/mobile.xml";
		this.gameCenterUrl = this.directoryUrl + "/gamecenter.xml";
		this.gameSummaryUrl = this.directoryUrl + "/linescore.xml";
		this.boxScoreUrl = this.directoryUrl + "/boxscore.xml";
		this.inningsUrl = this.directoryUrl + "/inning/inning_all.xml";
	}

	public async getHighlights()
	{
		const highlightsCollection = await Internal_DataLoader.loadXml<IHighlightsCollection>(this.highlightsUrl, "highlightsCollection");

		return highlightsCollection;
	}

	public async getGameCenter()
	{
		const gameCenterObj = await Internal_DataLoader.loadXml<IGameCenter>(this.gameCenterUrl, "gameCenter");

		return gameCenterObj;
	}

	public async getGameSummary()
	{
		const gameSummaryObj = await Internal_DataLoader.loadXml<IGameSummaryData>(this.gameSummaryUrl, "gameSummary");

		return gameSummaryObj;
	}

	public async getBoxscore()
	{
		const boxScoreObj = await Internal_DataLoader.loadXml<IBoxScoreContainer>(this.boxScoreUrl, "boxScore");

		return new BoxScoreData(boxScoreObj);
	}

	/**
	 * Gets the play-by-play for the game in question.
	 * @param boxScore Required to get information about players when they are only specified by ID
	 */
	public async getInnings(boxScore: BoxScoreData)
	{
		const inningsObj = await Internal_DataLoader.loadXml<IInningsContainer>(this.inningsUrl, "innings");

		return new Innings(inningsObj, boxScore);
	}

	private static async get<T>(url: string)
	{
		try
		{
			return await Internal_DataLoader.loadXml<T>(url);
		}
		catch (e)
		{
			Internal_GameDetailCreator.handleError(e);
		}
	}

	private static handleError(e: Error)
	{
		console.error(e);
	}
}