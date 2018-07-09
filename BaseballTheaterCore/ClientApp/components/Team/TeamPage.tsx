import * as React from "react";
import {ITeams, Teams} from "@MlbDataServer/Contracts";
import {RouteComponentProps} from "react-router";
import {ISchedule, IScheduleDate, IScheduleTeam, ITeamDetails} from "@MlbDataServer/Contracts/TeamSchedule";
import {LiveGameCreator} from "@MlbDataServer/MlbDataServer";
import {App} from "../Base/app";
import {GameSummaryRow} from "./GameSummaryRow";
import {ISettings} from "../../DataStore/SettingsDispatcher";
import {TabContainer} from "../shared/TabContainer";
import moment = require("moment");
import {Calendar, CalendarTypes} from "../GameList/Calendar";
import {Alert} from "antd";
import {AuthWrapper} from "../shared/AuthWrapper";

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
		this.getData(this.state.monthDate);

		this.settingsDispatcherKey = App.Instance.settingsDispatcher.register(payload => this.setState({
			settings: payload
		}));
	}

	private async getData(date: moment.Moment)
	{
		App.startLoading();

		const teamCode = this.props.match.params.team;

		const lgc = new LiveGameCreator();
		const schedule = await lgc.getTeamSchedule(Teams.TeamIdList[teamCode], date.year());
		const teamDetails = await lgc.getTeamDetails(Teams.TeamIdList[teamCode]);

		this.setState({
			schedule,
			teamDetails: teamDetails.teams[0]
		});

		App.stopLoading();
	}

	public componentWillUpdate(nextProps: RouteComponentProps<ITeamPageRouteParams>, nextState: ITeamPageState)
	{
		console.log(nextState);

		if (nextState.monthDate.year() !== this.state.monthDate.year())
		{
			this.setState({
				schedule: null
			});

			this.getData(nextState.monthDate);
		}
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
						if (matchingTeam.previousGameSchedule)
						{
							pastGamesForTeams = matchingTeam.previousGameSchedule.dates || [];
						}

						if (matchingTeam.nextGameSchedule)
						{
							futureGamesForTeams = matchingTeam.nextGameSchedule.dates || [];
						}
					}
				}

				const dates = [...pastGamesForTeams, ...futureGamesForTeams];

				const datesForMonth = dates.filter(a => moment(a.date).month() == this.state.monthDate.month());

				let gameSummaries: React.ReactNode[] = datesForMonth.map(date => {
					return date.games.map(game => <GameSummaryRow game={game} hideScores={this.state.settings.hideScores} focusedTeamCode={teamCode}/>);
				});

				if (gameSummaries.length === 0 && !App.isLoading)
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

						<div className={`game-list-table`}>
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
			<AuthWrapper>
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
			</AuthWrapper>
		);
	}
}