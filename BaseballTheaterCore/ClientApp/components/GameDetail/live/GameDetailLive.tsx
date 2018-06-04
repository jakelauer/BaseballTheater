import React = require("react");
import {GameData, GameSummaryData, LiveData, Player, PlayerListResponse, PlayerWithStats} from "@MlbDataServer/Contracts";
import {LiveGameCreator} from "@MlbDataServer/MlbDataServer"
import {Utility} from "@Utility/index";
import {App} from "../../Base/app";
import {PlayByPlayPitches} from "../play-by-play/play_by_play_pitches";
import {GameCount} from "./GameCount";
import {LiveInnings} from "./LiveInnings";
import {PlayerStatsCard} from "./PlayerStatsCard";
import {Row, Col} from "antd";

interface IGameDetailLiveProps
{
	currentGame: GameSummaryData;
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

	private renderCurrentPlay()
	{
		let rendered = <div/>;
		const currentPlay = this.state.game.liveData.plays.currentPlay;
		if (currentPlay)
		{
			const pitcher = this.getPlayerById(currentPlay.matchup.pitcher.id);
			const batter = this.getPlayerById(currentPlay.matchup.batter.id);

			rendered = (
				<div className={`current-play`}>
				</div>
			);
		}
		return rendered;
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

		const plays = this.state.game.liveData.plays;

		return <React.Fragment>
			<Row>
				<Col span={6}>
					<PlayerStatsCard data={pitcher}/> vs <PlayerStatsCard data={batter}/>
				</Col>
				<Col span={12}>
					<div className={`count`}>
						<GameCount data={currentPlay.count}/>
					</div>
					<div className={`result`}>{currentPlay.result.description}</div>
					<PlayByPlayPitches isSpringTraining={isSpringTraining} pitches={pitchArray}/>
				</Col>
				<Col span={6}></Col>
				{this.renderCurrentPlay()}
			</Row>
			<Row>
				<LiveInnings plays={plays} isSpringTraining={isSpringTraining}/>
			</Row>
		</React.Fragment>;
	}
}