import React = require("react");
import {GameData, GameSummaryData, LiveData, LiveGamePlay, Player, PlayerListResponse, PlayerWithStats} from "../../../MlbDataServer/Contracts";
import {LiveGameCreator} from "../../../MlbDataServer/MlbDataServer"
import {Timer} from "../../../Utility/Timer";
import {App} from "../../Base/app";
import {IPlayByPlayPitchData, PlayByPlayPitches} from "../play-by-play/play_by_play_pitches";
import {GameCount} from "./GameCount";
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
			this.timerId = Timer.interval(() => this.updateLiveData(), 5000);
		}
	}

	componentWillUnmount()
	{
		Timer.cancel(this.timerId);
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
			Timer.cancel(this.timerId);
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

	private getPitchDataForPlay(play: LiveGamePlay)
	{
		const pitchEvents = play.playEvents.filter(a => a.isPitch);
		const pitchData: IPlayByPlayPitchData[] = [];
		pitchEvents.forEach(event => pitchData.push({
			x: event.pitchData.coordinates.x,
			y: event.pitchData.coordinates.y,
			type: event.details.call.code
		}));

		return pitchData;
	}

	private renderCurrentPlay()
	{
		let rendered = <div/>;
		const currentPlay = this.state.game.liveData.plays.currentPlay;
		if (currentPlay)
		{
			const pitcher = this.getPlayerById(currentPlay.matchup.pitcher.id);
			const batter = this.getPlayerById(currentPlay.matchup.batter.id);
			const pitchArray = this.getPitchDataForPlay(currentPlay);

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
		const pitchArray = this.getPitchDataForPlay(currentPlay);

		return <Row>
			<Col span={6}>
				<PlayerStatsCard data={pitcher}/> vs <PlayerStatsCard data={batter}/>
			</Col>
			<Col span={12}>
				<div className={`count`}>
					<GameCount data={currentPlay.count}/>
				</div>
				<div className={`result`}>{currentPlay.result.description}</div>
				<PlayByPlayPitches isSpringTraining={this.props.currentGame.isSpringTraining} pitches={pitchArray}/>
			</Col>
			<Col span={6}></Col>
			{this.renderCurrentPlay()}
		</Row>;
	}
}