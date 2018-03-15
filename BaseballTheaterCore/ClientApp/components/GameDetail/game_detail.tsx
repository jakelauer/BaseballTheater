import {Moment} from "moment";
import * as moment from "moment/moment"
import * as React from "react";
import {BoxScoreData, GameSummaryData, IHighlightsCollection, IInningsContainer, Innings, LiveData} from "../../MlbDataServer/Contracts";
import {GameDetailCreator} from "../../MlbDataServer/game_detail_creator";
import {GameSummaryCreator} from "../../MlbDataServer/game_summary_creator";
import {Promises} from "../../Utility/promises";
import {Subscription} from "../../Utility/subscribable";
import {App, IGameUpdateDistributorPayload} from "../Base/app";
import {IPageProps} from "../Base/page";
import {Config} from "../shared/config";
import {BoxScore} from "./boxscore";
import {PlayByPlay} from "./play-by-play/play_by_play";
import {Highlights} from "./shared/highlights";
import {MiniBoxScore} from "./shared/miniboxscore";

export enum GameDetailTabs
{
	Highlights,
	PlayByPlay,
	BoxScore
}

interface IGameDetailState
{
	gameSummary: GameSummaryData | null;
	boxScore: BoxScoreData | null;
	highlightsCollection: IHighlightsCollection | null;
	playByPlay: IInningsContainer | null;
	liveData: LiveData | null;
	currentTab: GameDetailTabs;
}

interface IGameDetailUrlParams
{
	date: string;
	gamePk: string;
}

export class GameDetail extends React.Component<IPageProps<IGameDetailUrlParams>, IGameDetailState>
{
	private readonly date: Moment;
	private readonly gamePk: string;
	private liveSubscription: Subscription<IGameUpdateDistributorPayload>;

	constructor(props: any)
	{
		super(props);

		const dateString = this.props.match.params.date;
		this.date = moment(dateString, "YYYYMMDD");

		this.gamePk = this.props.match.params.gamePk;

		let currentTab = parseInt(this.props.settings.defaultTab);
		if (isNaN(currentTab))
		{
			currentTab = GameDetailTabs.Highlights;
		}

		if (App.Instance.isAppMode)
		{
			currentTab = GameDetailTabs.BoxScore;
		}

		this.state = {
			boxScore: null,
			highlightsCollection: null,
			gameSummary: null,
			playByPlay: null,
			liveData: null,
			currentTab
		}
	}

	public componentDidMount()
	{
		this.getData();
		this.subscribeToLiveData();
	}

	public componentWillUnmount()
	{
		this.unsubscribeToLiveData();
	}

	private showNoHighlights()
	{
		return true;
	}

	private getTeamSponsors(fileCode: string)
	{
		return 0;
	}

	private async getHighlights(currentGame: GameSummaryData): Promise<IHighlightsCollection>
	{
		const gameDetailCreator = new GameDetailCreator(currentGame.game_data_directory, false);
		const highlights = await gameDetailCreator.getHighlights();
		return highlights;
	}

	private async getBoxScore(currentGame: GameSummaryData): Promise<BoxScoreData>
	{
		const gameDetailCreator = new GameDetailCreator(currentGame.game_data_directory, false);
		const boxScore = await gameDetailCreator.getBoxscore();
		return boxScore;
	}

	private async getPlayByPlay(currentGame: GameSummaryData, boxScore: BoxScoreData): Promise<Innings>
	{
		const gameDetailCreator = new GameDetailCreator(currentGame.game_data_directory, false);
		const playByPlay = await gameDetailCreator.getInnings(boxScore);
		return playByPlay;
	}

	private async getLiveData(currentGame: GameSummaryData): Promise<LiveData>
	{
		const gameDetailCreator = new GameDetailCreator(currentGame.game_data_directory, false);
		const liveData = gameDetailCreator.getLiveGame(currentGame.game_pk);
		return liveData;
	}

	private setTabState(currentTab: GameDetailTabs)
	{
		this.setState({
			currentTab
		});
	}

	private subscribeToLiveData()
	{
		if (!Config.liveDataEnabled)
		{
			return null;
		}

		this.liveSubscription = App.Instance.gameUpdateDistributor.subscribe(payload =>
		{
			if (payload.gameIds.indexOf(parseInt(this.gamePk)) > -1)
			{
				console.log("Live update triggered.");
				this.getData();
			}
		})
	}

	private unsubscribeToLiveData()
	{
		if (this.liveSubscription)
		{
			App.Instance.gameUpdateDistributor.unsubscribe(this.liveSubscription);
		}
	}

	private getCurrentGame(): Promise<GameSummaryData>
	{
		return new Promise((resolve, reject) =>
		{
			const summaries = GameSummaryCreator.getSummaryCollection(this.date);

			summaries.then((gameSummaryCollection) =>
			{
				if (gameSummaryCollection.games && gameSummaryCollection.games.game)
				{
					const gameList = gameSummaryCollection.games.game;
					for (var game of gameList)
					{
						if (game.game_pk === this.gamePk)
						{
							resolve(game);
						}
					}

					reject(`No game found matching game_pk of ${this.gamePk}`);
				}
			});
		});
	}

	private async getData()
	{
		App.startLoading();

		try
		{
			const gameSummary = await this.getCurrentGame();
			const boxScore = await this.getBoxScore(gameSummary);
			const highlightsCollectionPromise = this.getHighlights(gameSummary);
			const playByPlayPromise = this.getPlayByPlay(gameSummary, boxScore);
			//const liveDataPromise = this.getLiveData(gameSummary);

			const rest = await Promises.all([highlightsCollectionPromise, playByPlayPromise]);
			const highlightsCollection = (!(rest[0] instanceof Error))
				? rest[0] as IHighlightsCollection
				: console.error("Highlights failed to load", rest[0]) || null;

			const playByPlay = (!(rest[1] instanceof Error))
				? rest[1] as Innings
				: console.error("Play by play data failed to load", rest[1]) || null;

			/*const liveData = (!(rest[2] instanceof Error))
				? rest[2] as MlbLiveData.LiveData
				: null;*/


			this.setState({
				gameSummary,
				boxScore,
				highlightsCollection,
				playByPlay
			});

			App.stopLoading();
		}
		catch (e)
		{
			console.log(e);

			App.stopLoading();
		}
	}

	private renderCurrentTab(currentTab: GameDetailTabs | null)
	{
		const boxScoreData = this.state.boxScore;
		const highlightsCollection = this.state.highlightsCollection;
		const playByPlayData = this.state.playByPlay;
		const gameSummary = this.state.gameSummary;
		const liveData = this.state.liveData;
		const allPlayers = boxScoreData ? boxScoreData.allPlayers : new Map();

		const gameIsInFuture = gameSummary && gameSummary.dateObj.isSameOrAfter(moment());

		let renderables = [<div/>];

		switch (currentTab)
		{
			case GameDetailTabs.Highlights:
				if (!highlightsCollection
					|| !highlightsCollection.highlights
					|| !highlightsCollection.highlights.media
					|| highlightsCollection.highlights.media.length === 0
					|| gameIsInFuture)
				{
					renderables = [
						<div key={0} className="no-data">No highlights are available for this game.</div>
					];
				}
				else
				{
					renderables = [
						<Highlights highlightsCollection={highlightsCollection} hideScores={this.props.settings.hideScores} key={0}/>
					];

				}
				break;
			case GameDetailTabs.BoxScore:
				if (!boxScoreData || gameIsInFuture)
				{
					renderables = [
						<div key={0} className="no-data">No box score data is available for this game.</div>
					];
				}
				else
				{
					renderables = [
						<MiniBoxScore boxScoreData={boxScoreData} hideScores={this.props.settings.hideScores} key={0}/>,
						<BoxScore boxScoreData={boxScoreData} key={1}/>
					];
				}
				break;
			case GameDetailTabs.PlayByPlay:
				if (!boxScoreData || !gameSummary || !playByPlayData || gameIsInFuture)
				{
					renderables = [
						<div key={0} className="no-data">No play-by-play data is available for this game.</div>
					];
				}
				else
				{
					renderables = [
						<MiniBoxScore boxScoreData={boxScoreData} hideScores={this.props.settings.hideScores} key={0}/>,
						<PlayByPlay
							key={1}
							gameSummary={gameSummary}
							inningsData={playByPlayData}
							highlights={highlightsCollection}
							allPlayers={allPlayers}/>
					];
				}
				break;
		}

		return (
			<div className={`tab-content on`} data-tab={currentTab}>
				{renderables}
			</div>
		);
	}

	public render()
	{
		const gameSummary = this.state.gameSummary;
		if (!gameSummary)
		{
			return (<div/>);
		}

		const highlightsTabClass = this.state.currentTab === GameDetailTabs.Highlights ? "on" : "";
		const playByPlayTabClass = this.state.currentTab === GameDetailTabs.PlayByPlay ? "on" : "";
		const boxScoreTabClass = this.state.currentTab === GameDetailTabs.BoxScore ? "on" : "";

		return (
			<div className={`game-detail-container`}>
				<div className={`game-data-tab-container`}>
					<div className={`tabs`}>
						<div className={`tab-container`}>
							<a href={`javascript:void(0)`} className={`tab ${highlightsTabClass}`} onClick={_ => this.setTabState(GameDetailTabs.Highlights)}>
								<span>Highlights</span>
							</a>
							<a href={`javascript:void(0)`} className={`tab ${playByPlayTabClass}`} onClick={_ => this.setTabState(GameDetailTabs.PlayByPlay)}>
								<span>Play by Play</span>
							</a>
							<a href={`javascript:void(0)`} className={`tab ${boxScoreTabClass}`} onClick={_ => this.setTabState(GameDetailTabs.BoxScore)}>
								<span>Box Score</span>
							</a>
						</div>
					</div>
					<div className={`tab-contents`}>
						{this.renderCurrentTab(this.state.currentTab)}
					</div>
				</div>
			</div>
		);
	}
}