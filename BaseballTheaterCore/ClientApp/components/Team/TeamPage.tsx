import * as React from "react";
import {ITeams, Teams} from "@MlbDataServer/Contracts";
import {RouteComponentProps} from "react-router";
import {ISchedule, IScheduleDate, IScheduleTeam, ITeamDetails} from "@MlbDataServer/Contracts/TeamSchedule";
import {LiveGameCreator} from "@MlbDataServer/MlbDataServer";
import {App} from "../Base/app";
import {GameSummary} from "./GameSummary";
import {ISettings} from "../../DataStore/SettingsDispatcher";
import {TabContainer} from "../shared/TabContainer";
import moment = require("moment");
import {Calendar, CalendarTypes} from "../GameList/calendar";
import {Alert} from "antd";

interface ITeamPageRouteParams
{
	team: keyof ITeams;
}

interface ITeamPageState
{
	schedule: ISchedule;
	teamDetails: IScheduleTeam;
	settings: ISettings;
	monthDate: moment.Moment;
}

export class TeamPage extends React.Component<RouteComponentProps<ITeamPageRouteParams>, ITeamPageState>
{
	private settingsDispatcherKey: string;

	constructor(props: RouteComponentProps<ITeamPageRouteParams>)
	{
		super(props);

		this.state = {
			schedule: null,
			teamDetails: null,
			settings: App.Instance.settingsDispatcher.state,
			monthDate: moment()
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

		const teamCode = this.props.match.params.team;

		const lgc = new LiveGameCreator();
		const schedule = await lgc.getTeamSchedule(Teams.TeamIdList[teamCode]);
		const teamDetails = await lgc.getTeamDetails(Teams.TeamIdList[teamCode]);

		this.setState({
			schedule,
			teamDetails: teamDetails.teams[0]
		});

		App.stopLoading();
	}

	private renderGames()
	{

	}

	private renderTabContent(tabKey: string)
	{
		const teamCode = this.props.match.params.team;

		switch (tabKey)
		{
			case "schedule":
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

				const dates = [...pastGamesForTeams, ...futureGamesForTeams];

				const datesForMonth = dates.filter(a => moment(a.date).month() == this.state.monthDate.month());

				let gameSummaries: React.ReactNode[] = datesForMonth.map(date => {
					return date.games.map(game => <GameSummary game={game} hideScores={this.state.settings.hideScores} includeDate={true}/>);
				});

				if (gameSummaries.length === 0)
				{
					gameSummaries.push(
						<Alert
							message="No games this month"
							type="info"
							showIcon
						/>
					);
				}

				return (
					<React.Fragment>
						<Calendar
							type={CalendarTypes.Month}
							initialDate={moment()}
							onDateChange={(monthDate: moment.Moment) => this.setState({monthDate})}/>

						<div className={`game-list`}>
							{gameSummaries}
						</div>
					</React.Fragment>
				);
		}
	}

	private getTabLink(tab: string)
	{
		return `/team/${this.props.match.params.team}/${tab}`;
	}

	public render()
	{
		if (!this.state.teamDetails)
		{
			return null;
		}

		return (
			<div className={`team-page`}>
				<h1>{this.state.teamDetails.name}</h1>
				<TabContainer tabs={[
					{
						key: "schedule",
						label: "Schedule",
						link: this.getTabLink("schedule"),
						render: () => this.renderTabContent("schedule")
					}
				]}/>
			</div>
		);
	}
}