import React = require("react");
import {IHighlightsCollection, LiveData, PlayerListResponse} from "@MlbDataServer/Contracts";
import {LiveGameCreator} from "@MlbDataServer/MlbDataServer";
import {Utility} from "@Utility/index";
import {Col, Row} from "antd";
import {LiveInnings} from "./LiveInnings";

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
	private wakeLockRequest: any;

	constructor(props: IGameDetailLiveProps)
	{
		super(props);

		this.state = {
			players: null
		};
	}

	public componentDidMount()
	{
		try
		{
			const navAny = (navigator as any);
			navAny.getWakeLock("screen").then(wakeLock =>
			{
				this.wakeLockRequest = wakeLock.createRequest();
			});
		}
		catch (e)
		{
			console.info("Wake Lock error: ", e);
		}
	}

	public componentWillUnmount()
	{
		if (this.wakeLockRequest)
		{
			this.wakeLockRequest.cancel();
		}
	}

	public async componentWillReceiveProps(nextProps: IGameDetailLiveProps)
	{
		const lgc = new LiveGameCreator();
		const playerIds = Utility.Mlb.getPlayerIdsFromGame(nextProps.game.gameData);
		lgc.getPlayers(playerIds).then(players =>
		{
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