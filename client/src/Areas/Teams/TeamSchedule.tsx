import * as React from "react";
import {Divider, List, ListItemText} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import {RouteComponentProps, withRouter} from "react-router";
import {MlbClientDataFetcher} from "../../Global/Mlb/MlbClientDataFetcher";
import {Teams} from "baseball-theater-engine";
import moment from "moment";
import {IScheduleTeamSchedule} from "baseball-theater-engine/contract/teamschedule";
import {ContainerProgress} from "../../UI/ContainerProgress";
import {Link} from "react-router-dom";
import {SiteRoutes} from "../../Global/Routes/Routes";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/moment";
import {GamesUtils} from "../../Utility/GamesUtils";
import styles from "./TeamSchedule.module.scss";

interface ITeamScheduleProps
{
}

interface DefaultProps
{
}

type Props = ITeamScheduleProps & DefaultProps & RouteComponentProps<{ teamFileCode: string }>;
type State = ITeamScheduleState;

interface ITeamScheduleState
{
	schedule: IScheduleTeamSchedule;
	selectedDate: moment.Moment;
}

class TeamSchedule extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			schedule: null,
			selectedDate: GamesUtils.StartingDate()
		};
	}

	public componentDidMount(): void
	{
		this.fetch();
	}

	public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void
	{
		if (prevProps.match.params.teamFileCode !== this.props.match.params.teamFileCode)
		{
			this.fetch();
		}
	}

	private fetch()
	{
		const fileCode = this.props.match.params.teamFileCode as keyof typeof Teams.TeamIdList;

		MlbClientDataFetcher.getTeamSchedule(Teams.TeamIdList[fileCode] as number, this.state.selectedDate.year())
			.then(data =>
			{
				if (data.teams?.length > 0)
				{
					const allGames = [...data.teams[0].previousGameSchedule?.dates, ...data.teams[0].nextGameSchedule?.dates];
					const lastDate = moment(allGames[allGames.length - 1].date);

					this.setState({
						schedule: data.teams[0],
						selectedDate: lastDate
					});
				}
			});
	}

	private onDateSelected = (newDate: moment.Moment) =>
	{
		const requiresFetch = newDate.year() !== this.state.selectedDate.year();

		this.setState({
			selectedDate: newDate,
			schedule: requiresFetch ? null : this.state.schedule
		}, () =>
		{
			if (requiresFetch)
			{
				this.fetch();
			}
		});
	};

	public render()
	{
		if (!this.state.schedule)
		{
			return <ContainerProgress/>;
		}

		const games = [
			...this.state.schedule.previousGameSchedule.dates,
			...this.state.schedule.nextGameSchedule.dates,
		].filter(game => moment(game.date).month() === this.state.selectedDate.month());

		return (
			<div className={styles.schedule}>
				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<DatePicker
						variant="inline"
						openTo="month"
						views={["year", "month"]}
						label="Schedule Month"
						value={this.state.selectedDate}
						onChange={this.onDateSelected}
					/>
				</MuiPickersUtilsProvider>
				<Divider style={{margin: "2rem 0"}}/>
				<List component="nav">
					{games.length === 0 && (
						<ListItem>
							<ListItemText>No Games Found</ListItemText>
						</ListItem>
					)}
					{games.map((gameDate) =>
					{
						const game = gameDate.games[0];
						const {
							away,
							home
						} = game.teams;
						const date = moment(gameDate.date);
						const isHome = home.team.fileCode === this.props.match.params.teamFileCode;
						const isWin = (isHome && home.score > away.score) || (!isHome && away.score > home.score);
						const isFinal = game.status.statusCode === "F";
						const winLoss = isFinal
							? isWin
								? "W"
								: "L"
							: "";

						const separator = isHome ? "vs." : "@";
						const thisTeam = isHome ? home : away;
						const otherTeam = isHome ? away : home;

						return (
							<ListItem button className={styles.item} component={p => <Link {...p} to={SiteRoutes.Game.resolve({gameId: game.gamePk})}/>}>
								<ListItemIcon>
									<div>
										{date.format("M/D")}
										<br/>
										{separator} {otherTeam.team.abbreviation}
									</div>
								</ListItemIcon>
								<ListItemText>
									<div className={styles.info}>
										<div>{winLoss}<br/>{away.score} - {home.score}</div>
										<div>
											W: {game.decisions?.winner?.nameFirstLast}
											<br/>
											L: {game.decisions?.loser?.nameFirstLast}
										</div>
									</div>
								</ListItemText>
							</ListItem>
						);
					})}
				</List>
			</div>
		);
	}
}

export default withRouter(TeamSchedule);