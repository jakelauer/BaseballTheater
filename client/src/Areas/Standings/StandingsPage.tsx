import * as React from "react";
import {MlbClientDataFetcher} from "../../Global/Mlb/MlbClientDataFetcher";
import moment from "moment";
import {Standings, StandingsRecord} from "baseball-theater-engine/contract/standings";
import {TableContainer} from "@material-ui/core";
import TableHead from "@material-ui/core/TableHead";
import Table from "@material-ui/core/Table";
import Tooltip from "@material-ui/core/Tooltip";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import {Link} from "react-router-dom";
import {SiteRoutes} from "../../Global/Routes/Routes";
import {ITeams} from "baseball-theater-engine";
import {ContainerProgress} from "../../UI/ContainerProgress";
import styles from "./StandingsPage.module.scss";

interface IStandingsPageProps
{
}

interface DefaultProps
{
}

type Props = IStandingsPageProps & DefaultProps;
type State = IStandingsPageState;

interface IStandingsPageState
{
	standings: Standings;
}

export class StandingsPage extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			standings: null
		};
	}

	public componentDidMount(): void
	{
		this.loadStandings();
	}

	private loadStandings()
	{
		MlbClientDataFetcher.getStandings(moment())
			.then(data => this.setState({
				standings: data
			}));
	}

	public render()
	{
		if (!this.state.standings)
		{
			return <ContainerProgress/>;
		}

		const records = this.state.standings.records;

		return (
			<div>
				{records.map(record => <Division {...record} />)}
			</div>
		);
	}
}

const Division: React.FC<StandingsRecord> = (props) =>
{
	return (
		<div style={{marginTop: "2rem"}}>
			<Typography variant="h5">
				{props.division.nameShort}
			</Typography>
			<TableContainer className={styles.table}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>
								Team
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
								<Tooltip title={"Games Back"} arrow placement={"top"}>
									<span>GB</span>
								</Tooltip>
							</TableCell>
							<TableCell>
								<Tooltip title={"Magic Number"} arrow placement={"top"}>
									<span>M#</span>
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
						{props.teamRecords.map(teamRecord => (
							<TableRow>
								<TableCell className={styles.cell}>
									<Link to={SiteRoutes.Team.resolve({team: teamRecord.team.fileCode as keyof ITeams})}>
										{teamRecord.team.teamName}
									</Link>
								</TableCell>
								<TableCell className={styles.cell}>{teamRecord.wins}</TableCell>
								<TableCell className={styles.cell}>{teamRecord.losses}</TableCell>
								<TableCell className={styles.cell}>{teamRecord.winningPercentage}</TableCell>
								<TableCell className={styles.cell}>{teamRecord.gamesBack}</TableCell>
								<TableCell className={styles.cell}>{teamRecord.magicNumber}</TableCell>
								<TableCell className={styles.cell}>{teamRecord.runsScored}</TableCell>
								<TableCell className={styles.cell}>{teamRecord.runsAllowed}</TableCell>
								<TableCell className={styles.cell}>{teamRecord.runDifferential}</TableCell>
								<TableCell className={styles.cell}>{teamRecord.records.expectedRecords[0].wins} - {teamRecord.records.expectedRecords[0].losses}</TableCell>
								<TableCell className={styles.cell}>{teamRecord.records.expectedRecords[1].wins} - {teamRecord.records.expectedRecords[1].losses}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};