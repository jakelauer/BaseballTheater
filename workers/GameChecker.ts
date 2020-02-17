import {GameSummaryCreator, LiveGameCreator} from "@MlbDataServer/MlbDataServer";
import {IGameSummaryData} from "@MlbDataServer/Contracts/GameSummary";
import {LiveData} from "@MlbDataServer/Contracts";
import {Utility} from "@Utility/index";
import {CustomStorage} from "./CustomStorage";
import moment = require("moment");

type SummaryCheck = (game: IGameSummaryData) => void;
type DetailCheck = (game: LiveData) => void;

export class GameChecker
{
	public static Instance = new GameChecker();

	private static readonly REFRESH_INTERVAL = 60 * 1000;

	private checkInterval = null;
	private summaryChecks: SummaryCheck[] = [];
	private detailChecks: DetailCheck[] = [];

	public addSummaryCheck(check: SummaryCheck)
	{
		this.summaryChecks.push(check);
	}

	public addDetailCheck(check: DetailCheck)
	{
		this.detailChecks.push(check);
	}

	public start()
	{
		this.getAndCheckGameSummaryData();

		this.checkInterval = setInterval(() =>
		{

			this.getAndCheckGameSummaryData();

		}, GameChecker.REFRESH_INTERVAL);
	}

	private stop()
	{
		clearInterval(this.checkInterval);
	}

	private async getAndCheckGameSummaryData()
	{
		try
		{
			const today = moment().add(-8, "hours");
			const gamesPromise = GameSummaryCreator.getSummaryCollectionNode(today);

			gamesPromise.then(gamesForToday =>
			{
				if (gamesForToday && gamesForToday.games && gamesForToday.games.game)
				{
					gamesForToday.games.game.forEach(game =>
						this.summaryChecks.forEach(check => check(game))
					);

					this.getAndCheckGameDetailData(gamesForToday.games.game);
				}
			});

		}
		catch (e)
		{
			console.error(e);
		}
	}

	private async getAndCheckGameDetailData(gamesForToday: IGameSummaryData[])
	{
		console.log(`Checking game details for ${gamesForToday.length} games`);

		const today = moment().add(-8, "hours");
		const todayFormatted = today.format("MMDDYYYY");

		const promises: Promise<LiveData>[] = [];
		gamesForToday.forEach(game =>
		{
			promises.push(LiveGameCreator.getLiveGameNode(game.game_pk));
		});

		const gameDetails = await Utility.Promises.all(promises);

		const finishedGames = gameDetails.filter(game =>
		{
			if (!(game instanceof Error))
			{
				return Utility.Mlb.gameIsFinal(game.gameData.status.statusCode);
			}

			return false;
		});

		const finishedKey = "finished-" + todayFormatted;
		const finishedGamePks = CustomStorage.Instance.Store.getItem(finishedKey);
		let finishedGamePksList = [];
		if (finishedGamePks)
		{
			finishedGamePksList = JSON.parse(finishedGamePks);
		}

		gameDetails.forEach(gameDetail =>
		{
			if (gameDetail instanceof Error)
			{
				console.error(gameDetail);
			}
			else
			{
				const alreadyFinished = finishedGamePksList.indexOf(gameDetail.gamePk) > -1;

				if (!alreadyFinished)
				{
					this.detailChecks.forEach(check => check(gameDetail));
				}
			}
		});

		const finishedVal = finishedGames.map((a: LiveData) => a.gamePk);
		CustomStorage.Instance.Store.setItem(finishedKey, JSON.stringify(finishedVal));
	}
}