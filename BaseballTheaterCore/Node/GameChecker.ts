import {GameSummaryCreator, LiveGameCreator} from "@MlbDataServer/MlbDataServer";
import {IGameSummaryData} from "@MlbDataServer/Contracts/GameSummary";
import {LiveData} from "@MlbDataServer/Contracts";
import {Utility} from "@Utility/index";
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

		this.checkInterval = setInterval(() => {

			this.getAndCheckGameSummaryData();

		}, GameChecker.REFRESH_INTERVAL);
	}

	private stop()
	{
		clearInterval(this.checkInterval);
	}

	private async getAndCheckGameSummaryData()
	{
		console.log(`Checking game summaries for ${moment()}`);

		try
		{
			const gamesPromise = GameSummaryCreator.getSummaryCollectionNode(moment());

			gamesPromise.then(gamesForToday => {
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

		const promises: Promise<LiveData>[] = [];
		gamesForToday.forEach(game => {
			promises.push(LiveGameCreator.getLiveGameNode(game.game_pk));
		});

		const gameDetails = await Utility.Promises.all(promises);
		gameDetails.forEach(gameDetail => {
			if (gameDetail instanceof Error)
			{
				console.error(gameDetail);
			}
			else
			{
				this.detailChecks.forEach(check => check(gameDetail));
			}
		});
	}
}