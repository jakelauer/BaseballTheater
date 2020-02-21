import * as React from "react";
import {BoxScorePlayer, GameTeam, TeamBoxScore} from "baseball-theater-engine";
import styles from "./BoxScoreTeam.module.scss";
import classNames from "classnames";
import {Player} from "../../../../../baseball-theater-engine/contract";

interface IBoxScoreTeamProps
{
	data: TeamBoxScore;
	team: GameTeam;
	players: { [key: string]: Player };
	className?: string;
}

interface DefaultProps
{
}

type Props = IBoxScoreTeamProps & DefaultProps;
type State = IBoxScoreTeamState;

interface IBoxScoreTeamState
{
}

export class BoxScoreTeam extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {};
	}

	public render()
	{
		const {data, team, className, players} = this.props;
		const battersAsPlayers = data?.batters?.map((b: number) => data.players[`ID${b}`]) ?? [];
		const pitchersAsPlayers = data?.pitchers?.map((p: number) => data.players[`ID${p}`]) ?? [];

		const batters = battersAsPlayers
			.filter(p => Object.keys(p.stats.batting).length)
			.sort((a, b) => data.battingOrder.indexOf(a.person.id) - data.battingOrder.indexOf(b.person.id))
			.map(p => <Batter fullPlayer={players[`ID${p.person.id}`]} player={p}/>);

		const pitchers = pitchersAsPlayers
			.filter(p => Object.keys(p.stats.pitching).length)
			.map(p => <Pitcher fullPlayer={players[`ID${p.person.id}`]} player={p}/>);

		const teamBackgroundClasses = classNames(styles.teamBackgroundPrimary, styles[team.fileCode]);
		const teamColorClasses = classNames(styles.teamColorPrimary, styles[team.fileCode]);
		const sectionLabelClasses = classNames(styles.sectionLabel, teamBackgroundClasses);

		return (
			<div className={classNames(className, styles.wrapper)}>
				<div className={styles.content}>
					<h2 className={teamColorClasses}>{data.team.name}</h2>
					<div className={sectionLabelClasses}>
						<span>Batting</span>
					</div>
					<table className={styles.boxScoreTable}>
						<tr>
							<th className={styles.player}>{"Player"}</th>
							<th>{"AB"}</th>
							<th>{"R"}</th>
							<th>{"H"}</th>
							<th>{"RBI"}</th>
							<th>{"BB"}</th>
							<th>{"K"}</th>
							<th>{"AVG"}</th>
							<th>{"OBP"}</th>
							<th>{"SLG"}</th>
						</tr>
						{batters}
					</table>
					<div className={sectionLabelClasses}>
						<span>Pitching</span>
					</div>
					<table className={styles.boxScoreTable}>
						<tr>
							<th className={styles.player}>Player</th>
							<th>{"IP"}</th>
							<th>{"H"}</th>
							<th>{"R"}</th>
							<th>{"ER"}</th>
							<th>{"BB"}</th>
							<th>{"SO"}</th>
							<th>{"HR"}</th>
							<th>{"ERA"}</th>
							<th>{"WHIP"}</th>
						</tr>
						{pitchers}
					</table>
					<div className={styles.notes}>
						{data.note.map(fl => (
							<div>
								<strong>{fl.label}: </strong> {fl.value}
							</div>
						))}
					</div>
					<div className={styles.info}>
						{data.info.map(i => (
							<div>
								{i.title}
								{i.fieldList.map(fl => (
									<div>
										<strong>{fl.label}: </strong> {fl.value}
									</div>
								))}
								<br/>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}
}

interface IPlayerItem
{
	player: BoxScorePlayer;
	fullPlayer: Player;
}

const Batter = ({player, fullPlayer}: IPlayerItem) =>
{
	const isSubstitute = player.gameStatus.isSubstitute;
	const playerClasses = classNames(styles.player, {[styles.substitute]: isSubstitute});

	return (
		<tr>
			<td className={playerClasses}>
				<strong>{player.stats.batting.note}</strong>
				<a href={`https://www.mlb.com/player/${player.person.id}`} target={"_blank"} rel={"noreferrer nofollow"}>
					{fullPlayer.lastName} (<span>{player.allPositions.map(a => a.abbreviation).join("-")}</span>)
				</a>
			</td>
			<td>{player.stats.batting.atBats || 0}</td>
			<td>{player.stats.batting.runs || 0}</td>
			<td>{player.stats.batting.hits || 0}</td>
			<td>{player.stats.batting.rbi || 0}</td>
			<td>{player.stats.batting.baseOnBalls || 0}</td>
			<td>{player.stats.batting.strikeOuts || 0}</td>
			<td>{player.seasonStats.batting.avg}</td>
			<td>{player.seasonStats.batting.obp}</td>
			<td>{player.seasonStats.batting.slg}</td>
		</tr>
	);
};

const Pitcher = ({player, fullPlayer}: IPlayerItem) =>
{
	return (
		<tr>
			<td className={styles.player}>
				<a href={`https://www.mlb.com/player/${player.person.id}`} target={"_blank"} rel={"noreferrer nofollow"}>
					{fullPlayer.lastInitName}
				</a>
			</td>
			<td>{player.stats.pitching.inningsPitched || 0}</td>
			<td>{player.stats.pitching.hits || 0}</td>
			<td>{player.stats.pitching.runs || 0}</td>
			<td>{player.stats.pitching.earnedRuns || 0}</td>
			<td>{player.stats.pitching.baseOnBalls || 0}</td>
			<td>{player.stats.pitching.strikeOuts || 0}</td>
			<td>{player.stats.pitching.homeRuns || 0}</td>
			<td>{player.seasonStats.pitching.era}</td>
			<td>{player.seasonStats.pitching.whip}</td>
		</tr>
	);
};