import * as React from "react";
import {ITeams, Teams} from "@MlbDataServer/Contracts";
import {RouteComponentProps} from "react-router";
import {ISchedule, IScheduleDate} from "@MlbDataServer/Contracts/TeamSchedule";
import {LiveGameCreator} from "@MlbDataServer/MlbDataServer";
import {App} from "../Base/app";
import {GameSummary} from "./GameSummary";
import {ISettings} from "../../DataStore/SettingsDispatcher";

interface ITeamPageRouteParams
{
	team: keyof ITeams;
}

interface ITeamPageState
{
	schedule: ISchedule;
	settings: ISettings;
}

export class TeamPage extends React.Component<RouteComponentProps<ITeamPageRouteParams>, ITeamPageState>
{
	private settingsDispatcherKey: string;
	
	constructor(props: RouteComponentProps<ITeamPageRouteParams>)
	{
		super(props);

		this.state = {
			schedule: null,
			settings: App.Instance.settingsDispatcher.state
		};
	}

	public componentDidMount()
	{
		this.getData();

		this.settingsDispatcherKey = App.Instance.settingsDispatcher.register(payload => this.setState({
			settings: payload
		}));
	}

	private async getData()
	{

		App.startLoading();

		const lgc = new LiveGameCreator();
		const schedule = await lgc.getTeamSchedule(Teams.TeamIdList[this.props.match.params.team]);

		this.setState({
			schedule
		});
		
		App.stopLoading();
	}

	public render()
	{
		const teamCode = this.props.match.params.team;

		let pastGamesForTeams: IScheduleDate[] = [];
		let futureGamesForTeams: IScheduleDate[] = [];

		const schedule = this.state.schedule;
		if (schedule && schedule.teams && schedule.teams.length > 0)
		{
			const matchingTeam = schedule.teams.find(a => a.fileCode === teamCode);
			if (matchingTeam)
			{
				pastGamesForTeams = matchingTeam.previousGameSchedule.dates;
				futureGamesForTeams = matchingTeam.nextGameSchedule.dates;
			}
		}
		
		const allGames = [...pastGamesForTeams, ...futureGamesForTeams];

		return allGames.map(date => {
			return date.games.map(game => <GameSummary game={game} hideScores={this.state.settings.hideScores}/>);
		});
	}
}