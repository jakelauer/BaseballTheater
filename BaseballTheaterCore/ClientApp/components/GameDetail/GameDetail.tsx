import {BoxScoreData, GameSummaryData, IHighlightsCollection, LiveData} from "@MlbDataServer/Contracts";
import {GameDetailCreator, GameSummaryCreator, LiveGameCreator} from "@MlbDataServer/MlbDataServer";
import {Utility} from "@Utility/index";
import {Subscription} from "@Utility/Subscribable";
import {Col, Row} from "antd";
import * as moment from "moment/";
import {RouteComponentProps} from "react-router";
import {Link} from "react-router-dom";
import {ISettings} from "../../DataStore/SettingsDispatcher";
import {App, IGameUpdateDistributorPayload} from "../Base/app";
import Config from "../Config/config";
import {BoxScore} from "./boxscore";
import {GameDetailLive} from "./live/GameDetailLive";
import {GameFieldStatus} from "./live/GameFieldStatus";
import {PlayByPlay} from "./play-by-play/play_by_play";
import {Highlights} from "./shared/highlights";
import {MiniBoxScore} from "./shared/miniboxscore";
import React = require("react");
import {ErrorBoundary} from "../Base/ErrorBoundary";

export enum GameDetailTabs
{
	Live = "Live",
	Highlights = "Highlights",
	BoxScore = "BoxScore"
}

interface IGameDetailState
{
	game: LiveData;
	gameSummary: GameSummaryData | null;
	boxScore: BoxScoreData | null;
	highlightsCollection: IHighlightsCollection | null;
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
	private timerId: number = 0;

	private get isFinal()
	{
		let final = false;
		if (this.state.game)
		{
			final = Utility.Mlb.gameIsFinal(this.state.game.gameData.status.statusCode);
		}
		return final;
	}

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
			game: null,
			boxScore: null,
			highlightsCollection: null,
			gameSummary: null,
			currentTab,
			settings: App.Instance.settingsDispatcher.state
		};
	}

	public componentWillMount()
	{
		this.settingsDispatcherKey = App.Instance.settingsDispatcher.register(payload => {
			let defaultTab = payload.defaultTab;
			if (defaultTab === "PlayByPlay")
			{
				defaultTab = GameDetailTabs[GameDetailTabs.Live];
				App.Instance.settingsDispatcher.update({
					defaultTab
				});

				App.setSettingsCookie({
					defaultTab
				});
			}

			if (defaultTab && !this.props.match.params.tab)
			{
				this.setState({
					currentTab: GameDetailTabs[defaultTab],
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

	public async componentDidMount()
	{
		await this.getData();
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

	private setTabState(currentTab: GameDetailTabs)
	{
		this.setState({
			currentTab
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
		return new Promise((resolve, reject) => {
			const summaries = GameSummaryCreator.getSummaryCollection(this.date);

			summaries.then((gameSummaryCollection) => {
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
			const highlightsCollection = await GameDetail.getHighlights(gameSummary);

			await this.updateLiveData();

			if (this.timerId === 0)
			{
				this.timerId = Utility.Timer.interval(() => this.updateLiveData(), 5000);
			}

			this.setState({
				gameSummary,
				boxScore,
				highlightsCollection,
			});

			App.stopLoading();
		}
		finally
		{
			App.stopLoading();
		}
	}

	private async updateLiveData()
	{
		if (this.isFinal)
		{
			console.log("Game is over, stopping automatic updates");
			Utility.Timer.cancel(this.timerId);
		}

		console.log("Updating live data...");

		const lgc = new LiveGameCreator();

		const game = await Internal_LiveGameCreator.getLiveGame(this.props.match.params.gamePk);

		this.setState({
			game
		});

		App.stopLoading();
	}

	private renderCurrentTab(currentTab: GameDetailTabs | null)
	{
		const boxScoreData = this.state.boxScore;
		const highlightsCollection = this.state.highlightsCollection;
		const gameSummary = this.state.gameSummary;

		const gameIsInFuture = gameSummary && gameSummary.dateObj.isSameOrAfter(moment());

		let renderables = <div/>;

		switch (currentTab)
		{
			case GameDetailTabs.Live:
				if (Config.liveDataEnabled)
				{
					renderables = <React.Fragment>
						<Row type={"flex"}>
							<Col className={`game-field-column`} md={24} lg={10} xl={8}>
								<GameFieldStatus game={this.state.game}/>
							</Col>
							<Col className={`boxscore-column`} md={24} lg={14} xl={16}>
								<MiniBoxScore game={this.state.game} hideScores={this.state.settings.hideScores}/>
							</Col>
						</Row>	
						
						<GameDetailLive game={this.state.game}
										isSpringTraining={gameSummary.isSpringTraining}
										highlights={highlightsCollection}/>
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
						<MiniBoxScore game={this.state.game} hideScores={this.state.settings.hideScores}/>
						<BoxScore boxScoreData={boxScoreData}/>
					</React.Fragment>;
				}
				break;
		}

		return (
			<div className={`tab-content on`} data-tab={currentTab}>
				<ErrorBoundary>
				{renderables}
				</ErrorBoundary>
			</div>
		);
	}

	private classForTab(tab: GameDetailTabs)
	{
		return this.state.currentTab === tab ? "on" : "";
	}

	public render()
	{
		const gameSummary = this.state.gameSummary;
		if (!gameSummary)
		{
			return (<div/>);
		}

		if (this.state.game && this.state.game.gameData && this.state.game.gameData.teams)
		{
			const date = this.state.gameSummary.dateObj.format("MMM Do, YYYY");
			document.title = `${date} - ${this.state.game.gameData.teams.away.name} @ ${this.state.game.gameData.teams.home.name} - Baseball Theater`;
		}
		
		const liveTabClass = this.classForTab(GameDetailTabs.Live);
		const highlightsTabClass = this.classForTab(GameDetailTabs.Highlights);
		const boxScoreTabClass = this.classForTab(GameDetailTabs.BoxScore);

		return (
			<div className={`game-detail-container`}>
				<div className={`game-data-tab-container`}>
					<div className={`tabs`}>
						<div className={`tab-container`}>
							{
								Config.liveDataEnabled &&
								<Link to={this.getTabUrl(GameDetailTabs.Live)} className={`tab ${liveTabClass}`} onClick={() => this.setTabState(GameDetailTabs.Live)}>
									<span>Pitch-by-pitch</span>
								</Link>
							}

							<Link to={this.getTabUrl(GameDetailTabs.Highlights)} className={`tab ${highlightsTabClass}`} onClick={() => this.setTabState(GameDetailTabs.Highlights)}>
								<span>Highlights</span>
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