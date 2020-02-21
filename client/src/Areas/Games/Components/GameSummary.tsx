import * as React from "react";
import {IScheduleGame, IScheduleGameStatus, IScheduleTeamItem} from "baseball-theater-engine/contract/teamschedule";
import styles from "./GameSummary.module.scss";
import {LiveGameLinescore} from "baseball-theater-engine";
import {Paper} from "@material-ui/core";
import classNames from "classnames";
import moment from "moment";
import {ISettingsDataStorePayload, SettingsDataStore} from "../../../Global/Settings/SettingsDataStore";
import {MdFavorite} from "react-icons/all";

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
	settings: ISettingsDataStorePayload;
}

export class GameSummary extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			hovered: false,
			settings: SettingsDataStore.state
		};
	}

	public componentDidMount(): void
	{
		SettingsDataStore.listen(data => this.setState({
			settings: data
		}));
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

		const homeIsFavorite = this.state.settings.favoriteTeams.indexOf(teams.home.team.fileCode) > -1;
		const awayIsFavorite = this.state.settings.favoriteTeams.indexOf(teams.away.team.fileCode) > -1;

		return (
			<Paper className={styles.gameSummary} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} elevation={elevation}>
				{status && (
					<Status status={status} gameDate={gameDate} linescore={linescore}/>
				)}
				{linescore &&
                <React.Fragment>
                    <Score home={false} team={teams.away} isFavorite={awayIsFavorite} linescore={linescore} hideScores={this.state.settings.hideScores}/>
                    <Score home={true} team={teams.home} isFavorite={homeIsFavorite} linescore={linescore} hideScores={this.state.settings.hideScores}/>
                </React.Fragment>
				}
				{!linescore &&
                <React.Fragment>
                    <Preview home={false} isFavorite={awayIsFavorite} team={teams.away}/>
                    <Preview home={true} isFavorite={homeIsFavorite} team={teams.home}/>
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
	isFavorite: boolean;
	children?: React.ReactNode;
}

interface IScoreProps extends ITeamRowProps
{
	hideScores: boolean;
	linescore: LiveGameLinescore;
}

const TeamRow = (props: ITeamRowProps) =>
{
	const teamNameClasses = classNames(styles.teamColorPrimary, styles[props.team.team.fileCode]);

	return (
		<div className={styles.teamRow}>
			<div className={styles.team}>
				<div className={teamNameClasses}>
					{props.team.team.teamName}
					{props.isFavorite && <MdFavorite style={{fontSize: "0.8rem", color: "red", paddingLeft: 4}}/>}
				</div>
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
		hideScores,
		...rest
	} = props;

	if (!linescore)
	{
		return null;
	}

	const teamValues = getHomeAwayVal(props.home, props.linescore.teams);

	const numberOrHidden = (val: number) => hideScores ? "-" : val;

	const runs = numberOrHidden(teamValues.runs);
	const hits = numberOrHidden(teamValues.hits);
	const errors = numberOrHidden(teamValues.errors);

	return (
		<TeamRow {...rest}>
			<div className={styles.rhe}>
				<div className={styles.score}>
					{runs}
				</div>
				<div className={styles.hits}>
					{hits}
				</div>
				<div className={styles.errors}>
					{errors}
				</div>
			</div>
		</TeamRow>
	);
};

const Preview = (props: ITeamRowProps) =>
{
	return (
		<TeamRow {...props}>
			{props.team.probablePitcher &&
            <div className={styles.preview}>
				{props.team.probablePitcher.nameFirstLast}
            </div>
			}
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