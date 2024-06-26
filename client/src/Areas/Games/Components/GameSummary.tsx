import { Chip } from '@material-ui/core';
import { LiveGameLinescore, Player } from 'baseball-theater-engine';
import { IScheduleGame, IScheduleGameStatus, IScheduleTeamItem } from 'baseball-theater-engine/contract/teamschedule';
import classNames from 'classnames';
import moment from 'moment';
import * as React from 'react';
import { MdFavorite } from 'react-icons/all';

import { ISettingsDataStorePayload, SettingsDataStore } from '../../../Global/Settings/SettingsDataStore';
import styles from './GameSummary.module.scss';

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
	settings: ISettingsDataStorePayload;
}

export class GameSummary extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			settings: SettingsDataStore.state
		};
	}

	public componentDidMount(): void
	{
		SettingsDataStore.listen(data => this.setState({
			settings: data
		}));
	}

	public render()
	{
		const {
			game
		} = this.props;

		const {
			linescore,
			decisions,
			gameDate,
			teams,
			content,
			status,
		} = game;

		const homeIsFavorite = this.state.settings.favoriteTeams.indexOf(teams.home.team.fileCode) > -1;
		const awayIsFavorite = this.state.settings.favoriteTeams.indexOf(teams.away.team.fileCode) > -1;

		const finished = status.abstractGameCode === "F";
		const future = moment().isBefore(gameDate);
		const hasScore = (linescore?.innings?.length ?? 0) > 0 && (status.abstractGameCode === "L" || status.abstractGameCode === "F");

		return (
			<>
				<div className={styles.gameData}>
					{status && (
						<Status status={status} gameDate={gameDate} linescore={linescore}/>
					)}
					{(!future && hasScore) &&
					<React.Fragment>
						<Score
							home={false}
							team={teams.away}
							hideRecord={this.state.settings.hideScores}
							isFavorite={awayIsFavorite}
							linescore={linescore}
							hideScores={this.state.settings.hideScores}
						/>
						<Score
							home={true}
							team={teams.home}
							hideRecord={this.state.settings.hideScores}
							isFavorite={homeIsFavorite}
							linescore={linescore}
							hideScores={this.state.settings.hideScores}
						/>
					</React.Fragment>
					}
					{(future || !hasScore) &&
					<React.Fragment>
						<Preview home={false} team={teams.away} isFavorite={awayIsFavorite} hideRecord={this.state.settings.hideScores}/>
						<Preview home={true} team={teams.home} isFavorite={homeIsFavorite} hideRecord={this.state.settings.hideScores}/>
					</React.Fragment>
					}
				</div>
				{finished && decisions && !this.state.settings.hideScores && (
					<div className={styles.decisions}>
						{(game.flags?.noHitter || game.flags?.perfectGame) && !this.state.settings.hideScores && (
							<Chip size={"small"} className={styles.flagged} label={game.flags?.perfectGame ? `Perfect Game` : `No Hitter`}/>
						)}
						<Decision label={"WIN"} player={decisions.winner}/>
						<Decision label={"LOSS"} player={decisions.loser}/>
						<Decision label={"SAVE"} player={decisions.save}/>
					</div>
				)}
			</>
		);
	}
}

const Decision = (props:
	{
		label: string;
		player: Player
	}
) =>
{
	if (!props.player)
	{
		return null;
	}

	return (
		<div className={styles.decision}>
			<div className={styles.decisionLabel}>{props.label}</div>
			<div>{props.player.initLastName}</div>
		</div>
	);
}

interface ITeamRowProps
{
	home: boolean;
	team: IScheduleTeamItem;
	isFavorite: boolean;
	hideRecord: boolean;
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
					{!props.hideRecord && (
						<div className={styles.record}>
							<>{props.team.leagueRecord.wins} - {props.team.leagueRecord.losses} ({props.team.leagueRecord.pct})</>
						</div>
					)}
				</div>
				<div className={styles.teamValue}>
					{props.children}
				</div>
			</div>
		);
	}
;

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
			<TeamRow hideRecord={hideScores} {...rest}>
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
	}
;

const Preview = (props: ITeamRowProps) =>
	{
		const probPitch = props.team?.probablePitcher;
		const stats = probPitch?.stats as any[];
		const pitchingSeasonStats = stats?.find(a => a.group?.displayName === "pitching" && a.type?.displayName === "statsSingleSeason");

		return (
			<TeamRow {...props}>
				<div className={styles.preview}>
					{!probPitch?.nameFirstLast && "TBD"}
					{probPitch && (
						<>
					{probPitch?.nameFirstLast} ({probPitch?.pitchHand?.code})
					{pitchingSeasonStats && (
						<>
							<div className={styles.record} style={{textAlign: "right"}}>
								({pitchingSeasonStats.stats?.wins} - {pitchingSeasonStats.stats?.losses}, {pitchingSeasonStats.stats?.era})
							</div>
						</>
					)}
					</>
					)}
				</div>
			</TeamRow>
		);
	}
;

const getHomeAwayVal =
	<T extends {}>(home: boolean, values: { home: T, away: T }) =>
	{
		return home ? values.home : values.away;
	};

interface IStatusProps
{
	status: IScheduleGameStatus;
	gameDate: string;
	linescore: LiveGameLinescore;
	children?: React.ReactNode;
}

const Status: React.FC<IStatusProps> = (props) =>
{
	const gameDate = moment(props.gameDate);
	const localDate = gameDate.local();
	const future = moment().isBefore(gameDate);
	const finished = props.status.abstractGameCode === "F";
	const hasScore = (props.linescore?.innings?.length ?? 0) > 0 && (props.status.abstractGameCode === "L" || props.status.abstractGameCode === "F");

	const inningLabel = props.linescore?.inningState ?? "";
	const currentInning = `${inningLabel} ${props.linescore?.currentInningOrdinal ?? ""}`;

	const statusString = props.status.statusCode === "I"
		? <Chip label={currentInning} size={"small"}/>
		: props.status.detailedState;

	return (
		<div className={styles.status}>
			<div className={styles.statusDetail}>
				{statusString}
			</div>
			{future && !finished &&
			<div className={styles.statusInfo}>
				{localDate.format("h:mma")}
			</div>
			}
			{props.children}
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