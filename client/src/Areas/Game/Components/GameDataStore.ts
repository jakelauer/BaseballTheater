import { GameMedia, IHighlightSearchItem, LiveData, MediaItem } from 'baseball-theater-engine';
import moment from 'moment';
import { createContext } from 'react';

import { DataStore } from '../../../Global/Intercom/DataStore';
import { MlbClientDataFetcher } from '../../../Global/Mlb/MlbClientDataFetcher';

export interface IGameDataStorePayload
{
	updateTime: moment.Moment;
	liveData: LiveData;
	media: GameMedia;
	lastRefresh: number;
	secondsUntilRefresh: number;
	cancelled: boolean;
}

export class GameDataStore extends DataStore<IGameDataStorePayload>
{
	private interval: number = null;
	private metaInterval: number = null;

	constructor(private gamePk: string, private ms: number = 30 * 1000)
	{
		super({
			updateTime: moment(),
			media: null,
			liveData: null,
			lastRefresh: Date.now(),
			secondsUntilRefresh: Math.floor(ms / 1000),
			cancelled: false
		});
	}

	public initialize(gamePk: string, ms = 31 * 1000)
	{
		this.gamePk = gamePk;
		this.ms = ms;

		this.cancel();
		
		this.update({
			updateTime: moment(),
			media: null,
			liveData: null,
			lastRefresh: Date.now(),
			secondsUntilRefresh: Math.floor(ms / 1000),
			cancelled: false
		});

		this.fetchLiveData();
		this.setInterval();
	}

	public setMs(ms: number)
	{
		clearInterval(this.interval);
		clearInterval(this.metaInterval);

		this.ms = ms;

		this.setInterval();
	}

	public get refreshSeconds()
	{
		return this.ms / 1000;
	}

	private setInterval()
	{
		clearTimeout(this.interval);
		clearInterval(this.metaInterval);

		this.interval = window.setTimeout(() =>
		{
			this.update({
				lastRefresh: Date.now(),
				updateTime: moment(),
				secondsUntilRefresh: 0
			});

			this.fetchLiveData();
		}, this.ms);

		this.metaInterval = window.setInterval(() =>
		{
			const msSinceRefresh = Date.now() - this.state.lastRefresh;
			const sSinceRefresh = msSinceRefresh / 1000;

			this.update({
				secondsUntilRefresh: Math.max(0, Math.floor(this.refreshSeconds - sSinceRefresh))
			});
		}, 1000);
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
		else
		{
			this.setInterval();
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

		if (!data?.highlights?.highlights?.items?.length)
		{
			MlbClientDataFetcher.videoLocalSearch(" ", 0, this.gamePk, 999).then((data: IHighlightSearchItem[]) =>
			{
				const mediaItems: MediaItem[] = data.map(h => h.highlight);
				const gm: GameMedia = {
					...this.state.media,
					highlights: {
						highlights: {
							items: mediaItems,
							live: mediaItems,
							scoreboardPreview: null,
							type: ""
						}
					},
				};

				this.update({
					media: gm
				});
			});
		}
	}

	public cancel()
	{
		clearInterval(this.interval);
		clearInterval(this.metaInterval);

		this.update({
			cancelled: true
		});
	}
}

export const GameDataStoreContext = createContext<IGameDataStorePayload>(null);
