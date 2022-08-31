import 'moment-duration-format';

import { CircularProgress, Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Skeleton } from '@material-ui/lab';
import { IScheduleGameList } from 'baseball-theater-engine/contract/teamschedule';
import { MlbUtils } from 'baseball-theater-engine/mlbutils';
import classNames from 'classnames';
import moment from 'moment/moment';
import * as React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import { MlbClientDataFetcher } from '../../Global/Mlb/MlbClientDataFetcher';
import { SiteRoutes } from '../../Global/Routes/Routes';
import { ISettingsDataStorePayload, SettingsDataStore } from '../../Global/Settings/SettingsDataStore';
import { ContainerProgress } from '../../UI/ContainerProgress';
import { GameSummary } from './Components/GameSummary';
import styles from './GameList.module.scss';

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
	hoveredGame: string | undefined;
	settings: ISettingsDataStorePayload;
}

export class GameList extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			loading: true,
			hoveredGame: undefined,
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
			loading: true,
			scoreboard: null
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

	private static getSearchLink(term: string, date: string)
	{
		return SiteRoutes.SearchDate.resolve({
			date,
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

			const aInProgress = a.status.abstractGameCode === "L" ? -1 : 0;
			const bInProgress = b.status.abstractGameCode === "L" ? -1 : 0;
			const progressReturn = aInProgress - bInProgress;

			const gameOverA = MlbUtils.gameIsOver(a) ? 1 : 0;
			const gameOverB = MlbUtils.gameIsOver(b) ? 1 : 0;

			const finalReturn = gameOverB - gameOverA;

			const startTimeReturn = aTime.milliseconds() - bTime.milliseconds();

			return favoriteReturn || progressReturn || finalReturn || startTimeReturn;
		}) ?? [];

		const hovered = (gameId: string | undefined) => this.setState({
			hoveredGame: gameId
		});

		const getElevation = (gameId: string | undefined) => gameId === this.state.hoveredGame ? 3 : 1;

		const gameSummaries = orderedGames
			.map(game =>
			{
				return (
					<Grid key={game.gamePk} item xs={12} sm={6} lg={4}>
						<Paper className={styles.gameSummary} onMouseEnter={() => hovered(game.gamePk)} onMouseLeave={() => hovered(undefined)} elevation={getElevation(game.gamePk)}>
							<Link to={SiteRoutes.Game.resolve({gameId: game.gamePk, gameDate: "_"})} className={styles.gameLink}>
								<GameSummary game={game}/>
							</Link>
						</Paper>
					</Grid>
				);
			});

		const formattedDate = this.props.day.format("MMMM D, YYYY");
		const urlDate = this.props.day.format();

		const anyGamesComplete = orderedGames.some(g => g.status.statusCode === "F");

		return (
			<React.Fragment>
				<Helmet>
					<title>{`Games for ${formattedDate}`}</title>
				</Helmet>

				{anyGamesComplete && (
					<>
						<div className={styles.specialHighlights}>
							<ButtonGroup variant={"outlined"} size={"small"} className={classNames(styles.buttonGroup, styles.first)}>
								<Button component={p => <Link {...p} to={GameList.getSearchLink("game-recap", urlDate)}/>}>
									Recaps
								</Button>
								<Button component={p => <Link {...p} to={GameList.getSearchLink("condensed-game", urlDate)}/>}>
									Condensed
								</Button>
								<Button component={p => <Link {...p} to={GameList.getSearchLink("player-tracking", urlDate)}/>}>
									StatCast
								</Button>
								<Button component={p => <Link {...p} to={GameList.getSearchLink("home-run", urlDate)}/>}>
									Home Runs
								</Button>
								<Button component={p => <Link {...p} to={GameList.getSearchLink("highlight-reel-offense", urlDate)}/>}>
									Top Offense
								</Button>
								<Button component={p => <Link {...p} to={GameList.getSearchLink("highlight-reel-defense", urlDate)}/>}>
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
