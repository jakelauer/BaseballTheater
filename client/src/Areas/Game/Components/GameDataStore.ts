import {DataStore} from "../../../Global/Intercom/DataStore";
import moment from "moment";
import {GameMedia, LiveData} from "baseball-theater-engine";
import {MlbClientDataFetcher} from "../../../Global/Mlb/MlbClientDataFetcher";
import {BackerType} from "../../../Global/AuthDataStore";
import {createContext} from "react";

export interface IGameDataStorePayload
{
	updateTime: moment.Moment;
	liveData: LiveData;
	media: GameMedia;
	upsellBackerType: BackerType | null;
}

export class GameDataStore extends DataStore<IGameDataStorePayload>
{
	private interval: number = null;

	constructor(private readonly gamePk: string, private readonly ms: number = 30 * 1000)
	{
		super({
			updateTime: moment(),
			media: null,
			liveData: null,
			upsellBackerType: null
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

	public showUpsell(backerType: BackerType)
	{
		this.update({
			upsellBackerType: backerType
		});
	}

	public hideUpsell()
	{
		this.update({
			upsellBackerType: null
		});
	}
}

export const GameDataStoreContext = createContext<GameDataStore>(null);
