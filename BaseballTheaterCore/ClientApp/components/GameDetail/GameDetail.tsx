import {BoxScoreData, GameSummaryData, LiveData} from "@MlbDataServer/Contracts";
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
import {ITabContainerTab, TabContainer} from "../shared/TabContainer";

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
	gameMedia: GameMedia;
	defaultTab: GameDetailTabs;
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

		this.state = {
			game: null,
			boxScore: null,
			gameMedia: null,
			gameSummary: null,
			defaultTab: this.getDefaultTab(this.props),
			settings: App.Instance.settingsDispatcher.state
		};
	}

	public componentWillMount()
	{
		this.settingsDispatcherKey = App.Instance.settingsDispatcher.register(payload =>
		{
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
					defaultTab: GameDetailTabs[defaultTab],
					settings: payload
				});
			}
		});
	}

	public componentWillReceiveProps(nextProps: RouteComponentProps<IGameDetailUrlParams>)
	{
		this.setTab(nextProps);
	}

	private setTab(props: RouteComponentProps<IGameDetailUrlParams>)
	{
		this.setState({
			defaultTab: this.getDefaultTab(props)
		})
	}

	private getDefaultTab(props: RouteComponentProps<IGameDetailUrlParams>): GameDetailTabs
	{
		let defaultTab = GameDetailTabs.Highlights;
		if (App.isAppMode)
		{
			defaultTab = GameDetailTabs.BoxScore;
		}
		else if (this.props.match.params.tab)
		{
			defaultTab = GameDetailTabs[props.match.params.tab];
		}

		return defaultTab;
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

	private static async getHighlights(currentGame: GameSummaryData): Promise<GameMedia>
	{
		return await LiveGameCreator.getGameMedia(currentGame.game_pk);
	}

	private static async getBoxScore(currentGame: GameSummaryData): Promise<BoxScoreData>
	{
		const gameDetailCreator = new GameDetailCreator(currentGame.game_data_directory, false);
		return await gameDetailCreator.getBoxscore();
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
			const gameMedia = await GameDetail.getHighlights(gameSummary);

			await this.updateLiveData();

			if (this.timerId === 0)
			{
				this.timerId = Utility.Timer.interval(() => this.updateLiveData(), 5000);
			}

			this.setState({
				gameSummary,
				boxScore,
				gameMedia,
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

		const game = await LiveGameCreator.getLiveGame(this.props.match.params.gamePk);
		const gameMedia = await LiveGameCreator.getGameMedia(this.props.match.params.gamePk);

		this.setState({
			game,
			gameMedia
		});

		App.stopLoading();
	}

	private renderTabContent(currentTab: GameDetailTabs | null)
	{
		const boxScoreData = this.state.boxScore;
		const gameMedia = this.state.gameMedia;
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
										gameMedia={gameMedia}/>
					</React.Fragment>;
				}
				break;
			case GameDetailTabs.Highlights:
				if (!gameMedia
					|| !gameMedia.highlights
					|| !gameMedia.highlights.highlights
					|| gameMedia.highlights.highlights.items.length === 0
					|| gameIsInFuture)
				{
					renderables = <div className="no-data">No highlights are available for this game.</div>;
				}
				else
				{
					renderables = <Highlights gameMedia={gameMedia} hideScores={this.state.settings.hideScores}/>;

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

		const tabs: ITabContainerTab[] = [
			{
				key: GameDetailTabs.Live,
				label: "Pitch-by-pitch",
				link: this.getTabUrl(GameDetailTabs.Live),
				render: () => this.renderTabContent(GameDetailTabs.Live)
			},
			{
				key: GameDetailTabs.Highlights,
				label: "Highlights",
				link: this.getTabUrl(GameDetailTabs.Highlights),
				render: () => this.renderTabContent(GameDetailTabs.Highlights)
			},
			{
				key: GameDetailTabs.BoxScore,
				label: "Box Score",
				link: this.getTabUrl(GameDetailTabs.BoxScore),
				render: () => this.renderTabContent(GameDetailTabs.BoxScore)
			}
		];

		return (
			<div className={`game-detail-container`}>
				<TabContainer tabs={tabs} defaultActiveTabKey={this.state.defaultTab}/>
			</div>
		);
	}
}