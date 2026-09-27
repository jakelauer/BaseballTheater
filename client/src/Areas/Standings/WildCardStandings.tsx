import * as React from "react";
import {League, Standings, StandingsRecord, TeamRecord} from "baseball-theater-engine/contract/standings";
import {TableContainer} from "@material-ui/core";
import TableHead from "@material-ui/core/TableHead";
import Table from "@material-ui/core/Table";
import Tooltip from "@material-ui/core/Tooltip";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import {Link} from "react-router-dom";
import classNames from "classnames";
import {SiteRoutes} from "../../Global/Routes/Routes";
import {ITeams} from "baseball-theater-engine";
import styles from "./StandingsPage.module.scss";

interface IWildCardStandingsProps
{
	standings: Standings;
}

interface WildCardTeamRecord extends TeamRecord
{
	divisionNameShort: string;
}

interface LeagueWildCardGroup
{
	league: League;
	leaders: WildCardTeamRecord[];
	teamRecords: WildCardTeamRecord[];
}

const groupByLeague = (records: StandingsRecord[]): LeagueWildCardGroup[] =>
{
	const groups = new Map<number, LeagueWildCardGroup>();

	records.forEach(record =>
	{
		if (!groups.has(record.league.id))
		{
			groups.set(record.league.id, {league: record.league, leaders: [], teamRecords: []});
		}

		const group = groups.get(record.league.id);

		record.teamRecords.forEach(teamRecord =>
		{
			const target = teamRecord.divisionLeader ? group.leaders : group.teamRecords;
			target.push({
				...teamRecord,
				divisionNameShort: record.division.nameShort
			});
		});
	});

	// wildCardGamesBack is relative to the cutoff, so sort by leagueRank
	const byLeagueRank = (a: TeamRecord, b: TeamRecord) => parseInt(a.leagueRank, 10) - parseInt(b.leagueRank, 10);

	return Array.from(groups.values())
		.map(group => ({
			...group,
			leaders: group.leaders.sort(byLeagueRank),
			teamRecords: group.teamRecords.sort(byLeagueRank)
		}))
		.sort((a, b) => a.league.id - b.league.id);
};

export const WildCardStandings: React.FC<IWildCardStandingsProps> = (props) =>
{
	const leagueGroups = groupByLeague(props.standings.records);

	return (
		<div>
			{leagueGroups.map(group => <WildCardLeagueTable key={group.league.id} {...group} />)}
		</div>
	);
};

const WildCardLeagueTable: React.FC<LeagueWildCardGroup> = (props) =>
{
	return (
		<>
			<LeagueTable
				title={`${props.league.abbreviation} Leaders`}
				teamRecords={props.leaders}
			/>
			<LeagueTable
				title={`${props.league.abbreviation} Wild Card`}
				teamRecords={props.teamRecords}
				cutoffIndex={props.league.numWildcardTeams - 1}
			/>
		</>
	);
};

interface ILeagueTableProps
{
	title: string;
	teamRecords: WildCardTeamRecord[];
	cutoffIndex?: number;
}

const LeagueTable: React.FC<ILeagueTableProps> = (props) =>
{
	const {teamRecords, cutoffIndex} = props;

	return (
		<div style={{marginTop: "2rem"}}>
			<Typography variant="h5">
				{props.title}
			</Typography>
			<TableContainer className={styles.table}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>
								Team
							</TableCell>
							<TableCell>
								<Tooltip title={"Division"} arrow placement={"top"}>
									<span>Div</span>
								</Tooltip>
							</TableCell>
							<TableCell>
								<Tooltip title={"Wins"} arrow placement={"top"}>
									<span>W</span>
								</Tooltip>
							</TableCell>
							<TableCell>
								<Tooltip title={"Losses"} arrow placement={"top"}>
									<span>L</span>
								</Tooltip>
							</TableCell>
							<TableCell>
								<Tooltip title={"Winning Percentage"} arrow placement={"top"}>
									<span>PCT</span>
								</Tooltip>
							</TableCell>
							<TableCell>
								<Tooltip title={"Wild Card Games Back"} arrow placement={"top"}>
									<span>WCGB</span>
								</Tooltip>
							</TableCell>
							<TableCell>
								<Tooltip title={"Wild Card Elimination Number"} arrow placement={"top"}>
									<span>E#</span>
								</Tooltip>
							</TableCell>
							<TableCell>
								<Tooltip title={"Runs Scored"} arrow placement={"top"}>
									<span>RS</span>
								</Tooltip>
							</TableCell>
							<TableCell>
								<Tooltip title={"Runs Allowed"} arrow placement={"top"}>
									<span>RA</span>
								</Tooltip>
							</TableCell>
							<TableCell>
								<Tooltip title={"Run Differential"} arrow placement={"top"}>
									<span>Diff</span>
								</Tooltip>
							</TableCell>
							<TableCell>
								<Tooltip title={"Expected Win-Loss"} arrow placement={"top"}>
									<span>xWL</span>
								</Tooltip>
							</TableCell>
							<TableCell>
								<Tooltip title={"Expected Win-Loss (Projected)"} arrow placement={"top"}>
									<span>xWLP</span>
								</Tooltip>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{teamRecords.map((teamRecord, index) =>
						{
							const isCutoff = index === cutoffIndex && index !== teamRecords.length - 1;
							const cellClass = classNames(styles.cell, {[styles.cutoff]: isCutoff});

							return (
								<TableRow key={teamRecord.team.id}>
									<TableCell className={cellClass}>
										<Link to={SiteRoutes.Team.resolve({team: teamRecord.team.fileCode as keyof ITeams})}>
											{teamRecord.team.teamName}
										</Link>
									</TableCell>
									<TableCell className={cellClass}>{teamRecord.divisionNameShort}</TableCell>
									<TableCell className={cellClass}>{teamRecord.wins}</TableCell>
									<TableCell className={cellClass}>{teamRecord.losses}</TableCell>
									<TableCell className={cellClass}>{teamRecord.winningPercentage}</TableCell>
									<TableCell className={cellClass}>{teamRecord.wildCardGamesBack}</TableCell>
									<TableCell className={cellClass}>{teamRecord.wildCardEliminationNumber}</TableCell>
									<TableCell className={cellClass}>{teamRecord.runsScored}</TableCell>
									<TableCell className={cellClass}>{teamRecord.runsAllowed}</TableCell>
									<TableCell className={cellClass}>{teamRecord.runDifferential}</TableCell>
									<TableCell className={cellClass}>{teamRecord.records.expectedRecords[0].wins} - {teamRecord.records.expectedRecords[0].losses}</TableCell>
									<TableCell className={cellClass}>{teamRecord.records.expectedRecords[1].wins} - {teamRecord.records.expectedRecords[1].losses}</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};