import * as React from "react";
import {LiveData} from "baseball-theater-engine";
import {BoxScoreTeam} from "./Components/BoxScoreTeam";
import {CircularProgress, Tab, Tabs} from "@material-ui/core";
import styles from "./BoxScore.module.scss";
import {Respond} from "../../Global/Respond/Respond";
import {RespondSizes} from "../../Global/Respond/RespondIntercom";

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
	selectedTeam: string;
}

export class BoxScore extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			selectedTeam: props.liveData?.liveData?.boxscore?.teams?.away?.team?.name ?? ""
		};
	}

	public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void
	{
		if (prevState.selectedTeam === "" && this.props.liveData?.liveData?.boxscore?.teams?.away?.team?.name)
		{
			this.setState({
				selectedTeam: this.props.liveData?.liveData?.boxscore?.teams?.away?.team?.name
			});
		}
	}

	private readonly onTeamSelect = (e: any, selectedTeam: string) => this.setState({selectedTeam});

	public render()
	{
		if (!this.props.liveData)
		{
			return <CircularProgress/>;
		}

		const gameData = this.props.liveData.gameData;
		const boxscore = this.props.liveData.liveData.boxscore;
		const players = gameData.players;

		const {
			away,
			home
		} = this.props.liveData?.liveData?.boxscore?.teams ?? {};

		return (
			<div className={styles.bothTeams}>
				<Respond at={RespondSizes.small} hide={false}>
					<Tabs
						className={styles.inningTabs}
						orientation={"horizontal"}
						variant="scrollable"
						value={this.state.selectedTeam}
						onChange={this.onTeamSelect}
						indicatorColor="primary"
						textColor="primary"
					>
						<Tab label={boxscore.teams.away.team.name} value={boxscore.teams.away.team.name}/>
						<Tab label={boxscore.teams.home.team.name} value={boxscore.teams.home.team.name}/>
					</Tabs>
				</Respond>

				<Respond at={RespondSizes.small} hide={this.state.selectedTeam !== boxscore.teams.away.team.name} ignoreIfUnmatched={true}>
					<BoxScoreTeam
						data={away}
						team={gameData.teams.away}
						players={players}
						className={styles.team}/>
				</Respond>

				<Respond at={RespondSizes.small} hide={this.state.selectedTeam !== boxscore.teams.home.team.name} ignoreIfUnmatched={true}>
					<BoxScoreTeam
						data={home}
						team={gameData.teams.home}
						players={players}
						className={styles.team}/>
				</Respond>
			</div>
		);
	}
}