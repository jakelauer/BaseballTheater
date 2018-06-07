import React = require("react");
import {GameData, GameSummaryData, IHighlightsCollection, LiveData, Player, PlayerListResponse, PlayerWithStats} from "@MlbDataServer/Contracts";
import {LiveGameCreator} from "@MlbDataServer/MlbDataServer"
import {Utility} from "@Utility/index";
import {App} from "../../Base/app";
import {PlayByPlayPitches} from "../play-by-play/play_by_play_pitches";
import {GameCount} from "./GameCount";
import {LiveInnings} from "./LiveInnings";
import {PlayerStatsCard} from "./PlayerStatsCard";
import {Row, Col, List} from "antd";

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

	componentDidMount()
	{
		App.startLoading();
		this.updateLiveData();

		if (this.timerId === 0)
		{
			this.timerId = Utility.Timer.interval(() => this.updateLiveData(), 5000);
		}
	}

	componentWillUnmount()
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

	private getPlayerById(playerId: number): PlayerWithStats | null
	{
		if (this.state.players)
		{
			return this.state.players.people.find(a => a.id === playerId);
		}

		return null;
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

		const pitcher = this.getPlayerById(currentPlay.matchup.pitcher.id);
		const batter = this.getPlayerById(currentPlay.matchup.batter.id);
		const pitchArray = Utility.Mlb.getPitchDataForPlay(currentPlay);
		const isSpringTraining = this.props.currentGame.isSpringTraining;

		const pitchDescs = currentPlay.playEvents
			.filter(a => a.isPitch);

		return <React.Fragment>
			<Row gutter={16}>
				<Col span={12}>
					<LiveInnings data={this.state.game.liveData} isSpringTraining={isSpringTraining} showInnings={"current"} highlights={this.props.highlights}/>
				</Col>
				<Col span={12}>
					<h2>All Innings</h2>
					<LiveInnings data={this.state.game.liveData} isSpringTraining={isSpringTraining} showInnings={"all"} highlights={this.props.highlights}/>
				</Col>
			</Row>
		</React.Fragment>;
	}
}