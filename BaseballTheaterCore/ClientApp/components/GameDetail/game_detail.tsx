import {BoxScoreData, GameSummaryData, IHighlightsCollection, IInningsContainer, Innings} from "@MlbDataServer/Contracts";
import {GameDetailCreator, GameSummaryCreator} from "@MlbDataServer/MlbDataServer";
import {Utility} from "@Utility/index";
import {Subscription} from "@Utility/Subscribable";
import * as moment from "moment/"
import {RouteComponentProps} from "react-router";
import {Link} from "react-router-dom";
import {ISettings} from "../../DataStore/SettingsDispatcher";
import {App, IGameUpdateDistributorPayload} from "../Base/app";
import Config from "../Config/config";
import {BoxScore} from "./boxscore";
import {GameDetailLive} from "./live/GameDetailLive";
import {PlayByPlay} from "./play-by-play/play_by_play";
import {Highlights} from "./shared/highlights";
import {MiniBoxScore} from "./shared/miniboxscore";
import React = require("react");

export enum GameDetailTabs
{
	Live = "Live",
	Highlights = "Highlights",
	PlayByPlay = "PlayByPlay",
	BoxScore = "BoxScore"
}

interface IGameDetailState
{
	gameSummary: GameSummaryData | null;
	boxScore: BoxScoreData | null;
	highlightsCollection: IHighlightsCollection | null;
	playByPlay: IInningsContainer | null;
	currentTab: GameDetailTabs;
	settings: ISettings | null;
}

interface IGameDetailUrlParams
{
	date: string;
	gamePk: string;
	tab?: string;
}

export class GameDetail extends React.Component<RouteComponentProps<IGameDetailUrlParams>, IGameDetailState>
{
	private readonly date: moment.Moment;
	private readonly gamePk: string;
	private liveSubscription: Subscription<IGameUpdateDistributorPayload>;
	private settingsDispatcherKey: string;

	constructor(props: any)
	{
		super(props);

		const dateString = this.props.match.params.date;
		this.date = moment(dateString, "YYYYMMDD");

		this.gamePk = this.props.match.params.gamePk;

		let currentTab = GameDetailTabs.Highlights;
		if (App.isAppMode)
		{
			currentTab = GameDetailTabs.BoxScore;
		}
		else if (this.props.match.params.tab)
		{
			currentTab = GameDetailTabs[this.props.match.params.tab];
		}

		this.state = {
			boxScore: null,
			highlightsCollection: null,
			gameSummary: null,
			playByPlay: null,
			currentTab,
			settings: App.Instance.settingsDispatcher.state
		}
	}

	public componentWillMount()
	{
		this.settingsDispatcherKey = App.Instance.settingsDispatcher.register(payload =>
		{
			const defaultTab = payload.defaultTab;

			if (defaultTab && !this.props.match.params.tab)
			{
				this.setState({
					currentTab: GameDetailTabs[payload.defaultTab],
					settings: payload
				});
			}
		});
	}

	private getTabUrl(tab: GameDetailTabs)
	{
		const game = this.state.gameSummary;
		return `/game/${game.urlDate}/${game.game_pk}/${tab}`;
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

	private static async getHighlights(currentGame: GameSummaryData): Promise<IHighlightsCollection>
	{
		const gameDetailCreator = new GameDetailCreator(currentGame.game_data_directory, false);
		return await gameDetailCreator.getHighlights();
	}

	private static async getBoxScore(currentGame: GameSummaryData): Promise<BoxScoreData>
	{
		const gameDetailCreator = new GameDetailCreator(currentGame.game_data_directory, false);
		return await gameDetailCreator.getBoxscore();
	}

	private static async getPlayByPlay(currentGame: GameSummaryData, boxScore: BoxScoreData): Promise<Innings>
	{
		const gameDetailCreator = new GameDetailCreator(currentGame.game_data_directory, false);
		return await gameDetailCreator.getInnings(boxScore);
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
		});
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
					for (const game of gameList)
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
			const boxScore = await GameDetail.getBoxScore(gameSummary);
			const highlightsCollectionPromise = GameDetail.getHighlights(gameSummary);
			const playByPlayPromise = GameDetail.getPlayByPlay(gameSummary, boxScore);

			const rest = await Utility.Promises.all([highlightsCollectionPromise, playByPlayPromise]);
			const highlightsCollection = (!(rest[0] instanceof Error))
				? rest[0] as IHighlightsCollection
				: console.error("Highlights failed to load", rest[0]) || null;

			const playByPlay = (!(rest[1] instanceof Error))
				? rest[1] as Innings
				: console.error("Play by play data failed to load", rest[1]) || null;

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
		const allPlayers = boxScoreData ? boxScoreData.allPlayers : new Map();

		const gameIsInFuture = gameSummary && gameSummary.dateObj.isSameOrAfter(moment());

		let renderables = <div/>;

		switch (currentTab)
		{
			case GameDetailTabs.Live:
				if (Config.liveDataEnabled)
				{
					renderables = <React.Fragment>
						<MiniBoxScore boxScoreData={boxScoreData} hideScores={this.state.settings.hideScores}/>
						<GameDetailLive currentGame={gameSummary}/>
					</React.Fragment>;
				}
				break;
			case GameDetailTabs.Highlights:
				if (!highlightsCollection
					|| !highlightsCollection.highlights
					|| !highlightsCollection.highlights.media
					|| highlightsCollection.highlights.media.length === 0
					|| gameIsInFuture)
				{
					renderables = <div className="no-data">No highlights are available for this game.</div>;
				}
				else
				{
					renderables = <Highlights highlightsCollection={highlightsCollection} hideScores={this.state.settings.hideScores}/>;

				}
				break;
			case GameDetailTabs.BoxScore:
				if (!boxScoreData || gameIsInFuture)
				{
					renderables = <div className="no-data">No box score data is available for this game.</div>;
				}
				else
				{
					renderables = <React.Fragment>
						<MiniBoxScore boxScoreData={boxScoreData} hideScores={this.state.settings.hideScores}/>
						<BoxScore boxScoreData={boxScoreData}/>
					</React.Fragment>;
				}
				break;
			case GameDetailTabs.PlayByPlay:
				if (!boxScoreData || !gameSummary || !playByPlayData || gameIsInFuture)
				{
					renderables = <div className="no-data">No play-by-play data is available for this game.</div>;
				}
				else
				{
					renderables = <React.Fragment>
						<MiniBoxScore boxScoreData={boxScoreData} hideScores={this.state.settings.hideScores}/>
						<PlayByPlay
							gameSummary={gameSummary}
							inningsData={playByPlayData}
							highlights={highlightsCollection}
							allPlayers={allPlayers}/>
					</React.Fragment>;
				}
				break;
		}

		return (
			<div className={`tab-content on`} data-tab={currentTab}>
				{renderables}
			</div>
		);
	}

	private classForTab(tab: GameDetailTabs)
	{
		return this.state.currentTab === tab ? "on" : ""
	}

	public render()
	{
		const gameSummary = this.state.gameSummary;
		if (!gameSummary)
		{
			return (<div/>);
		}
		
		const date = this.state.gameSummary.dateObj.format("MMM Do, YYYY");
		document.title = `${date} - ${this.state.boxScore.home_fname} @ ${this.state.boxScore.away_fname} - Baseball Theater`;

		const liveTabClass = this.classForTab(GameDetailTabs.Live);
		const highlightsTabClass = this.classForTab(GameDetailTabs.Highlights);
		const playByPlayTabClass = this.classForTab(GameDetailTabs.PlayByPlay);
		const boxScoreTabClass = this.classForTab(GameDetailTabs.BoxScore);

		return (
			<div className={`game-detail-container`}>
				<div className={`game-data-tab-container`}>
					<div className={`tabs`}>
						<div className={`tab-container`}>
							{
								Config.liveDataEnabled &&
								<Link to={this.getTabUrl(GameDetailTabs.Live)} className={`tab ${liveTabClass}`} onClick={() => this.setTabState(GameDetailTabs.Live)}>
									<span>Live</span>
								</Link>
							}
							
							<Link to={this.getTabUrl(GameDetailTabs.Highlights)} className={`tab ${highlightsTabClass}`} onClick={() => this.setTabState(GameDetailTabs.Highlights)}>
								<span>Highlights</span>
							</Link>
							
							<Link to={this.getTabUrl(GameDetailTabs.PlayByPlay)} className={`tab ${playByPlayTabClass}`} onClick={() => this.setTabState(GameDetailTabs.PlayByPlay)}>
								<span>Play by Play</span>
							</Link>
							
							<Link to={this.getTabUrl(GameDetailTabs.BoxScore)} className={`tab ${boxScoreTabClass}`} onClick={() => this.setTabState(GameDetailTabs.BoxScore)}>
								<span>Box Score</span>
							</Link>
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