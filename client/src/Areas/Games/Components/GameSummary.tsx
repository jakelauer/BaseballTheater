import * as React from "react";
import {IScheduleGame, IScheduleGameStatus, IScheduleTeamItem} from "baseball-theater-engine/dist/contract/teamschedule";
import styles from "./GameSummary.module.scss";
import {LiveGameLinescore} from "baseball-theater-engine/dist";
import {Paper} from "@material-ui/core";
import classNames from "classnames";
import moment from "moment";

interface IGameSummaryProps
{
	game: IScheduleGame;
}

interface DefaultProps
{
}

type Props = IGameSummaryProps & DefaultProps;
type State = IGameSummaryState;

interface IGameSummaryState
{
	hovered: boolean;
}

export class GameSummary extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			hovered: false
		};
	}

	private onMouseEnter = () =>
	{
		this.setState({
			hovered: true
		})
	};

	private onMouseLeave = () =>
	{
		this.setState({
			hovered: false
		})
	};

	public render()
	{
		const {
			game
		} = this.props;

		const {
			linescore,
			gameDate,
			teams,
			status,
			decisions,
		} = game;

		const elevation = this.state.hovered ? 3 : 1;

		return (
			<Paper className={styles.gameSummary} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} elevation={elevation}>
				{status &&
                <Status status={status} gameDate={gameDate} linescore={linescore}/>
				}
				{linescore &&
                <React.Fragment>
                    <Score home={false} team={teams.away} linescore={linescore}/>
                    <Score home={true} team={teams.home} linescore={linescore}/>
                </React.Fragment>
				}
				{!linescore &&
                <React.Fragment>
                    <Preview home={false} team={teams.away}/>
                    <Preview home={true} team={teams.home}/>
                </React.Fragment>
				}
			</Paper>
		);
	}
}

interface ITeamRowProps
{
	home: boolean;
	team: IScheduleTeamItem;
	children?: React.ReactNode;
}

interface IScoreProps extends ITeamRowProps
{
	linescore: LiveGameLinescore;
}

const TeamRow = (props: ITeamRowProps) =>
{
	const teamNameClasses = classNames(styles.teamColorPrimary, styles[props.team.team.fileCode]);

	return (
		<div className={styles.teamRow}>
			<div className={styles.team}>
				<div className={teamNameClasses}>{props.team.team.teamName}</div>
				<div className={styles.record}>
					{props.team.leagueRecord.wins} - {props.team.leagueRecord.losses} ({props.team.leagueRecord.pct})
				</div>
			</div>
			<div className={styles.teamValue}>
				{props.children}
			</div>
		</div>
	);
};

const Score = (props: IScoreProps) =>
{
	const {
		linescore,
		...rest
	} = props;

	if (!linescore)
	{
		return null;
	}

	const teamValues = getHomeAwayVal(props.home, props.linescore.teams);

	return (
		<TeamRow {...rest}>
			<div className={styles.rhe}>
				<div className={styles.score}>
					{teamValues.runs}
				</div>
				<div className={styles.hits}>
					{teamValues.hits}
				</div>
				<div className={styles.errors}>
					{teamValues.errors}
				</div>
			</div>
		</TeamRow>
	);
};

const Preview = (props: ITeamRowProps) =>
{
	return (
		<TeamRow {...props}>
			<div className={styles.preview}>
				{props.team.probablePitcher.nameFirstLast}
			</div>
		</TeamRow>
	);
};

const getHomeAwayVal = <T extends {}>(home: boolean, values: { home: T, away: T }) =>
{
	return home ? values.home : values.away;
};

interface IStatusProps
{
	status: IScheduleGameStatus;
	gameDate: string;
	linescore: LiveGameLinescore;
}

const Status = (props: IStatusProps) =>
{
	const future = props.status.statusCode === "S";
	const final = props.status.statusCode === "F";
	const hasScore = props.linescore && props.linescore.innings && props.linescore.innings.length > 0;
	const date = moment(props.gameDate).local();

	return (
		<div className={styles.status}>
			<div className={styles.statusDetail}>{props.status.detailedState}</div>
			{future &&
            <div className={styles.statusInfo}>
				{date.format("hh:mma")}
            </div>
			}
			{hasScore &&
            <div className={styles.statusInfo}>
                <div className={styles.rhe}>
                    <div>R</div>
                    <div>H</div>
                    <div>E</div>
                </div>
            </div>
			}
		</div>
	);
};