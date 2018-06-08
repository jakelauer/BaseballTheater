import React = require("react");
import {GameData, GameSummaryData, IHighlightsCollection, LiveData, Player, PlayerListResponse, PlayerWithStats} from "@MlbDataServer/Contracts";
import {LiveGameCreator} from "@MlbDataServer/MlbDataServer";
import {Utility} from "@Utility/index";
import {App} from "../../Base/app";
import {LiveInnings} from "./LiveInnings";
import {Col, Row} from "antd";

interface IGameDetailLiveProps
{
	game: LiveData;
	isSpringTraining: boolean;
	highlights: IHighlightsCollection | null;
}

interface IGameDetailLiveState
{
	players: PlayerListResponse;
}

export class GameDetailLive extends React.Component<IGameDetailLiveProps, IGameDetailLiveState>
{
	private get isFinal()
	{
		let final = false;
		if (this.props.game)
		{
			final = Utility.Mlb.gameIsFinal(this.props.game.gameData.status.statusCode);
		}
		return final;
	}

	constructor(props: IGameDetailLiveProps)
	{
		super(props);

		this.state = {
			players: null
		};
	}

	public async componentWillReceiveProps(nextProps: IGameDetailLiveProps)
	{
		const lgc = new LiveGameCreator();
		const playerIds = Utility.Mlb.getPlayerIdsFromGame(nextProps.game.gameData);
		lgc.getPlayers(playerIds).then(players => {
			this.setState({
				players
			});
		});
	}

	public render()
	{
		const data = this.props.game;
		if (!data)
		{
			return null;
		}

		const currentPlay = this.props.game.liveData.plays.currentPlay;
		if (!currentPlay)
		{
			return null;
		}

		const isSpringTraining = this.props.isSpringTraining;
		const isFinal = Utility.Mlb.gameIsFinal(this.props.game.gameData.status.statusCode);

		const allInningsCols = isFinal ? 24 : 8;

		return <React.Fragment>

			<Row gutter={16} type={"flex"}>

				{!isFinal &&
				<Col md={24} lg={16} className={`current-inning`}>

					<LiveInnings
						game={this.props.game}
						isSpringTraining={isSpringTraining}
						showInnings={"current"}
						highlights={this.props.highlights}/>
				</Col>
				}

				<Col md={24} lg={allInningsCols} className={`all-innings`}>
					<h2>All Innings</h2>
					<LiveInnings
						game={this.props.game}
						isSpringTraining={isSpringTraining}
						showInnings={"all"}
						highlights={this.props.highlights}/>
				</Col>
			</Row>
		</React.Fragment>;
	}
}