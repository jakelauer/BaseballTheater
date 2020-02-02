import {Intercom} from "../../../Global/Intercom/intercom";
import moment from "moment";
import {MlbClientDataFetcher} from "../../../Global/Mlb/MlbClientDataFetcher";
import {GameMedia, LiveData} from "baseball-theater-engine";

export interface IGameIntercomState
{
	updateTime: moment.Moment;
	liveData: LiveData;
	media: GameMedia;
}

export class GameIntercom extends Intercom<IGameIntercomState>
{
	private interval: number = null;

	constructor(private readonly gamePk: string, private readonly ms: number = 30 * 1000)
	{
		super({
			updateTime: moment(),
			media: null,
			liveData: null
		});

		this.fetchLiveData();
		this.setInterval();
	}

	private setInterval()
	{
		this.interval = window.setInterval(() =>
		{
			this.update({
				updateTime: moment()
			});

			this.fetchLiveData();
		}, this.ms);
	}

	private fetchLiveData()
	{
		MlbClientDataFetcher.getLiveGame(this.gamePk)
			.then(data => this.onFetch(data))
			.catch(e => console.error(e));

		MlbClientDataFetcher.getGameMedia(this.gamePk)
			.then(data => this.onFetchMedia(data))
			.catch(e => console.error(e));
	}


	private onFetch(data: LiveData)
	{
		const isFinal = data.gameData.status.statusCode === "F";
		if (isFinal)
		{
			this.cancel();
		}

		this.update({
			liveData: data
		});
	}

	private onFetchMedia(data: GameMedia)
	{
		this.update({
			media: data
		});
	}

	public cancel()
	{
		clearInterval(this.interval);
	}
}
