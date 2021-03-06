import * as React from "react";
import moment from "moment/moment";
import {MlbClientDataFetcher} from "../../Global/Mlb/MlbClientDataFetcher";
import {CircularProgress, Paper} from "@material-ui/core";
import {GameSummary} from "./Components/GameSummary";
import styles from "./GameList.module.scss";
import Grid from "@material-ui/core/Grid";
import {Link} from "react-router-dom";
import {SiteRoutes} from "../../Global/Routes/Routes";
import {IScheduleGameList} from "baseball-theater-engine/contract/teamschedule";
import {MlbUtils} from "baseball-theater-engine/mlbutils";
import {ContainerProgress} from "../../UI/ContainerProgress";
import {ISettingsDataStorePayload, SettingsDataStore} from "../../Global/Settings/SettingsDataStore";
import Helmet from "react-helmet";
import Typography from "@material-ui/core/Typography";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import {Skeleton} from "@material-ui/lab";
import classNames from "classnames";

interface IGameListProps
{
	day: moment.Moment;
}

interface DefaultProps
{
}

type Props = IGameListProps & DefaultProps;
type State = IGameListState;

interface IGameListState
{
	loading: boolean;
	scoreboard: IScheduleGameList;
	isCurrent: boolean;
	settings: ISettingsDataStorePayload;
}

export class GameList extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			loading: true,
			scoreboard: null,
			settings: SettingsDataStore.state,
			isCurrent: false
		}
	}

	public componentDidMount()
	{
		this.fetchSchedule();
		SettingsDataStore.listen(settings => this.setState({settings}));
	}

	public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void
	{
		if (!prevProps.day.isSame(this.props.day))
		{
			this.fetchSchedule();
		}
	}

	private fetchSchedule()
	{
		this.setState({
			loading: true
		});

		MlbClientDataFetcher.getScoreboard(this.props.day)
			.then(data =>
			{
				const isCurrent = !data.dates.some(d => d.totalGamesInProgress === 0);

				this.setState({
					scoreboard: data,
					isCurrent,
					loading: false
				});
			}, () =>
			{
				if (this.state.isCurrent)
				{
					setTimeout(() => this.fetchSchedule(), 30 * 1000);
				}
			})
	}

	private static getSearchLink(term: string, games: string[])
	{
		return SiteRoutes.Search.resolve({
			gameIds: games.join(","),
			query: term
		});
	}

	public render()
	{
		if (!this.state.scoreboard)
		{
			const count = Array(20).fill(0);
			return (
				<>
					<ContainerProgress/>
					<Grid className={styles.gameSummaries} container spacing={3} style={{paddingLeft: 0}}>

						{count.map(i =>
							<Grid key={i} item xs={12} sm={6} lg={4}>
								<Paper className={styles.gameSummary} elevation={4} variant={"elevation"}>
									<Skeleton style={{height: "10rem"}}/>
								</Paper>
							</Grid>)
						}
					</Grid>
				</>
			);
		}


		const favoriteTeams = this.state.settings.favoriteTeams;

		const orderedGames = this.state.scoreboard.dates?.[0]?.games?.sort((a, b) =>
		{
			const aIsFavorite = (favoriteTeams.indexOf(a.teams.home.team.fileCode) > -1 || favoriteTeams.indexOf(a.teams.away.team.fileCode) > -1) ? -1 : 0;
			const bIsFavorite = (favoriteTeams.indexOf(b.teams.home.team.fileCode) > -1 || favoriteTeams.indexOf(b.teams.away.team.fileCode) > -1) ? -1 : 0;
			const favoriteReturn = aIsFavorite - bIsFavorite;

			const aTime = moment(a.gameDate);
			const bTime = moment(b.gameDate);

			const startTimeReturn = aTime.isBefore(bTime)
				? -1
				: aTime.isAfter(bTime)
					? 1
					: 0;

			const finalReturn = MlbUtils.gameIsOver(a) ? 1 : 0;

			return favoriteReturn || finalReturn || startTimeReturn;
		}) ?? [];

		const gameSummaries = orderedGames
			.map(game => (
				<Grid key={game.gamePk} item xs={12} sm={6} lg={4}>
					<Link to={SiteRoutes.Game.resolve({gameId: game.gamePk, gameDate: "_"})} className={styles.gameLink}>
						<GameSummary game={game}/>
					</Link>
				</Grid>
			));

		const formattedDate = this.props.day.format("MMMM D, YYYY");

		const anyGamesComplete = orderedGames.some(g => g.status.statusCode === "F");
		const gameIds = orderedGames.map(g => g.gamePk);

		return (
			<React.Fragment>
				<Helmet>
					<title>{`Games for ${formattedDate}`}</title>
				</Helmet>

				{anyGamesComplete && (
					<>
						<div className={styles.specialHighlights}>
							<ButtonGroup variant={"outlined"} size={"small"} className={classNames(styles.buttonGroup, styles.first)}>
								<Button component={p => <Link {...p} to={GameList.getSearchLink("recap", gameIds)}/>}>
									Recaps
								</Button>
								<Button component={p => <Link {...p} to={GameList.getSearchLink("condensed", gameIds)}/>}>
									Condensed
								</Button>
								<Button component={p => <Link {...p} to={GameList.getSearchLink("must-c", gameIds)}/>}>
									Must C
								</Button>
								<Button component={p => <Link {...p} to={GameList.getSearchLink("StatCast", gameIds)}/>}>
									StatCast
								</Button>
								<Button component={p => <Link {...p} to={GameList.getSearchLink("home run", gameIds)}/>}>
									Home Runs
								</Button>
								<Button component={p => <Link {...p} to={GameList.getSearchLink("defense", gameIds)}/>}>
									Top Defense
								</Button>
							</ButtonGroup>
						</div>
						<Divider style={{marginBottom: "2rem"}}/>
					</>
				)}

				<Grid className={styles.gameSummaries} container spacing={3} style={{paddingLeft: 0}}>
					{
						this.state.loading
							? <CircularProgress className={styles.progress}/>
							: gameSummaries
					}

					{gameSummaries.length === 0 && !this.state.loading && (
						<div style={{textAlign: "center", width: "100%", marginTop: 100}}>
							<Typography>No games found</Typography>
						</div>
					)}
				</Grid>
			</React.Fragment>
		);
	}
}