import { Divider, List, ListItemText } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import { MlbClientDataFetcher } from "../../Global/Mlb/MlbClientDataFetcher";
import { Teams } from "baseball-theater-engine";
import moment from "moment";
import { IScheduleTeamSchedule } from "baseball-theater-engine/contract/teamschedule";
import { ContainerProgress } from "../../UI/ContainerProgress";
import { Link } from "react-router-dom";
import { SiteRoutes } from "../../Global/Routes/Routes";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/moment";
import { GamesUtils } from "../../Utility/GamesUtils";
import styles from "./TeamSchedule.module.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

interface ITeamScheduleState {
	schedule: IScheduleTeamSchedule;
	selectedDate: moment.Moment;
}

const TeamSchedule: React.FC = (props) => {
	const params = useParams<{ teamFileCode: string }>();

	const [schedule, setSchedule] = useState<IScheduleTeamSchedule | null>(null);
	const [selectedDate, setSelectedDate] = useState<moment.Moment>(GamesUtils.StartingDate());

	useEffect(() => {
		fetch();
	}, [params.teamFileCode]);

	useEffect(() => {
		if (!schedule) {
			fetch();
		}
	}, [schedule]);

	const fetch = () => {
		const fileCode = params.teamFileCode as keyof typeof Teams.TeamIdList;

		MlbClientDataFetcher.getTeamSchedule(Teams.TeamIdList[fileCode] as number, selectedDate.year())
			.then(data => {
				if (data.teams?.length > 0) {
					const allGames = [...data.teams[0].previousGameSchedule?.dates, ...data.teams[0].nextGameSchedule?.dates];
					const lastDate = moment(allGames[allGames.length - 1].date);

					setSchedule(data.teams[0]);
					setSelectedDate(lastDate);
				}
			});
	}

	const onDateSelected = (newDate: moment.Moment) => {
		const requiresFetch = newDate.year() !== selectedDate.year();

		setSelectedDate(newDate);
		setSchedule(requiresFetch ? null : schedule);
	};

	if (!schedule) {
		return <ContainerProgress />;
	}

	const games = [
		...schedule.previousGameSchedule.dates,
		...schedule.nextGameSchedule.dates,
	].filter(game => moment(game.date).month() === selectedDate.month());

	return (
		<div className={styles.schedule}>
			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<DatePicker
					variant="inline"
					openTo="month"
					views={["year", "month"]}
					label="Schedule Month"
					value={selectedDate}
					onChange={onDateSelected}
				/>
			</MuiPickersUtilsProvider>
			<Divider style={{ margin: "2rem 0" }} />
			<List component="nav">
				{games.length === 0 && (
					<ListItem>
						<ListItemText>No Games Found</ListItemText>
					</ListItem>
				)}
				{games.map((gameDate) => {
					const game = gameDate.games[0];
					const {
						away,
						home
					} = game.teams;
					const date = moment(gameDate.date);
					const isHome = home.team.fileCode === params.teamFileCode;
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
						<ListItem button className={styles.item} component={p => <Link {...p} to={SiteRoutes.Game.resolve({ gameId: game.gamePk })} />}>
							<ListItemIcon>
								<div>
									{date.format("M/D")}
									<br />
									{separator} {otherTeam.team.abbreviation}
								</div>
							</ListItemIcon>
							<ListItemText>
								<div className={styles.info}>
									<div>{winLoss}<br />{away.score} - {home.score}</div>
									<div>
										W: {game.decisions?.winner?.nameFirstLast}
										<br />
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

export default TeamSchedule