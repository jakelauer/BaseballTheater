import * as React from "react";
import {LiveData} from "baseball-theater-engine";
import {BoxScoreTeam} from "./Components/BoxScoreTeam";
import {Tab, Tabs} from "@material-ui/core";
import styles from "./BoxScore.module.scss";
import {Respond} from "../../Global/Respond/Respond";
import {RespondSizes} from "../../Global/Respond/RespondDataStore";
import Helmet from "react-helmet";
import moment from "moment";
import SwipeableViews from "react-swipeable-views";
import {ContainerProgress} from "../../UI/ContainerProgress";

interface IBoxScoreProps
{
	liveData: LiveData;
}

interface DefaultProps
{
}

type Props = IBoxScoreProps & DefaultProps;
type State = IBoxScoreState;

interface IBoxScoreState
{
	index: number;
}

export class BoxScore extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			index: 0
		};
	}

	private readonly onTeamSelect = (index: number) => this.setState({index});

	public render()
	{
		if (!this.props.liveData)
		{
			return <ContainerProgress/>;
		}

		const gameData = this.props.liveData.gameData;
		const boxscore = this.props.liveData.liveData.boxscore;
		const players = gameData.players;

		const {
			away,
			home
		} = this.props.liveData?.liveData?.boxscore?.teams ?? {};

		const teams = this.props.liveData.gameData.teams;
		const date = moment(this.props.liveData.gameData.datetime.dateTime).format("MMMM D, YYYY");

		const teamsRendered = [
			<BoxScoreTeam
				data={away}
				team={gameData.teams.away}
				players={players}
				className={styles.team}/>,
			<BoxScoreTeam
				data={home}
				team={gameData.teams.home}
				players={players}
				className={styles.team}/>
		];

		return (
			<div>
				<Helmet>
					<title>{`Box Score - ${teams.away.teamName} @ ${teams.home.teamName}, ${date}`}</title>
				</Helmet>
				<div className={styles.bothTeams}>
					<Respond at={RespondSizes.small} hide={false}>
						<Tabs
							className={styles.inningTabs}
							orientation={"horizontal"}
							variant="scrollable"
							value={this.state.index}
							onChange={(e, i) => this.onTeamSelect(i)}
							indicatorColor="primary"
							textColor="primary"
						>
							<Tab label={boxscore.teams.away.team.name} value={0}/>
							<Tab label={boxscore.teams.home.team.name} value={1}/>
						</Tabs>
					</Respond>

					<Respond at={RespondSizes.small} hide={false}>
						<SwipeableViews index={this.state.index} onChangeIndex={this.onTeamSelect}>
							{teamsRendered}
						</SwipeableViews>
					</Respond>

					<Respond at={RespondSizes.small} hide={true}>
						{teamsRendered}
					</Respond>
				</div>
				<div style={{padding: 16, fontSize: 13}}>
					{boxscore.info.map(data => (
						<div>
							<strong>{data.label}: </strong>
							<span>{data.value}</span>
						</div>
					))}
				</div>
			</div>
		);
	}
}