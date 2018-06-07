import React = require("react");
import {GameData, GameSummaryData, IHighlightsCollection, LiveData, Player, PlayerListResponse, PlayerWithStats} from "@MlbDataServer/Contracts";
import {LiveGameCreator} from "@MlbDataServer/MlbDataServer";
import {Utility} from "@Utility/index";
import {App} from "../../Base/app";
import {LiveInnings} from "./LiveInnings";
import {Col, Row} from "antd";

interface IGameDetailLiveProps
{
	currentGame: GameSummaryData;
	highlights: IHighlightsCollection | null;
}

interface IGameDetailLiveState
{
	game: LiveData;
	players: PlayerListResponse;
}

export class GameDetailLive extends React.Component<IGameDetailLiveProps, IGameDetailLiveState>
{
	private timerId: number = 0;

	constructor(props: IGameDetailLiveProps)
	{
		super(props);

		this.state = {
			game: null,
			players: null
		}
	}

	public componentDidMount()
	{
		App.startLoading();
		
		this.updateLiveData();

		if (this.timerId === 0)
		{
			this.timerId = Utility.Timer.interval(() => this.updateLiveData(), 5000);
		}
	}

	public componentWillUnmount()
	{
		Utility.Timer.cancel(this.timerId);
	}

	private static getPlayerIdsFromGame(gameData: GameData)
	{
		const playerList = Object.values(gameData.players) as Player[];
		return playerList.map(a => a.id);
	}

	private async updateLiveData()
	{
		if (this.props.currentGame.isFinal)
		{
			console.log("Game is over, stopping automatic updates");
			Utility.Timer.cancel(this.timerId);
		}

		console.log("Updating live data...");

		const lgc = new LiveGameCreator();

		const game = await lgc.getLiveGame(this.props.currentGame.game_pk);

		const playerIds = GameDetailLive.getPlayerIdsFromGame(game.gameData);
		const players = await lgc.getPlayers(playerIds);

		this.setState({
			game,
			players
		});

		App.stopLoading();
	}

	public render()
	{
		const data = this.state.game;
		if (!data)
		{
			return null;
		}

		const currentPlay = this.state.game.liveData.plays.currentPlay;
		if (!currentPlay)
		{
			return null;
		}

		const isSpringTraining = this.props.currentGame.isSpringTraining;
		const isFinal = Utility.Mlb.gameIsFinal(this.state.game.gameData.status.statusCode);
		
		const allInningsCols = isFinal ? 24 : 8;
		
		return <React.Fragment>
			<Row gutter={16} type={"flex"}>
				
				{!isFinal &&
				<Col md={24} lg={16} className={`current-inning`}>
					<LiveInnings data={this.state.game.liveData} isSpringTraining={isSpringTraining} showInnings={"current"} highlights={this.props.highlights}/>
				</Col>
				}
				
				<Col md={24} lg={allInningsCols} className={`all-innings`}>
					<h2>All Innings</h2>
					<LiveInnings data={this.state.game.liveData} isSpringTraining={isSpringTraining} showInnings={"all"} highlights={this.props.highlights}/>
				</Col>
			</Row>
		</React.Fragment>;
	}
}