import * as React from "react";
import moment from "moment/moment";
import {MlbClientDataFetcher} from "../../Global/Mlb/MlbClientDataFetcher";
import {CircularProgress} from "@material-ui/core";
import {GameSummary} from "./Components/GameSummary";
import styles from "./GameList.module.scss";
import Grid from "@material-ui/core/Grid";
import {Link} from "react-router-dom";
import {SiteRoutes} from "../../Global/Routes/Routes";
import {IScheduleGameList} from "baseball-theater-engine/contract/teamschedule";

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
}

export class GameList extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {
			loading: true,
			scoreboard: null,
			isCurrent: false
		}
	}

	public componentDidMount()
	{
		this.fetchSchedule();

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

	public render()
	{
		if (!this.state.scoreboard)
		{
			return <CircularProgress/>;
		}

		const gameSummaries = this.state.scoreboard.dates[0].games
			.map(game => (
				<Grid key={game.gamePk} item xs={12} sm={6} lg={4}>
					<Link to={SiteRoutes.Game.resolve({gameId: game.gamePk})} className={styles.gameLink}>
						<GameSummary game={game}/>
					</Link>
				</Grid>
			));

		return (
			<Grid className={styles.gameSummaries} container spacing={3}>
				{
					this.state.loading
						? <CircularProgress className={styles.progress}/>
						: gameSummaries
				}
			</Grid>
		);
	}
}