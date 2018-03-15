import * as moment from "moment/moment"
import * as React from "react"
import {GameSummaryCollection, GameSummaryData} from "../../MlbDataServer/Contracts";
import {GameSummaryCreator} from "../../MlbDataServer/game_summary_creator";
import {LinkHandler} from "../../Utility/link_handler";
import {Subscription} from "../../Utility/subscribable";
import {App} from "../Base/app";
import {IPageProps, ISettings} from "../Base/page";
import {Calendar} from "./calendar";
import {GameSummary} from "./game_summary";

interface IGameListState
{
	gameSummaries: GameSummaryData[];
	date: moment.Moment;
	navigating: boolean;
}

interface IGameListRouteParams
{
	date: string;
}

interface IGameListProps extends IPageProps<IGameListRouteParams>
{
	settings: ISettings;
}

export class GameList extends React.Component<IGameListProps, IGameListState>
{
	private pikaday: any;
	private linkHandlerSubscription: Subscription<Location>;

	constructor(props: IGameListProps)
	{
		super(props);

		//const date = GameList.getDateFromPath();
		const dateString = this.props.match.params.date;
		const date = moment(dateString, "YYYYMMDD");

		this.state = {
			gameSummaries: [],
			date,
			navigating: false
		};
	}

	private updateDate = (newDate: moment.Moment) =>
	{
		this.setState({
			date: newDate
		}, () => this.loadGamesForCurrentDate());
	};

	public static getDefaultDate()
	{
		const lastEndingDay = "20171101";
		const nextOpeningDay = "20180223";

		const openingDay2017 = moment(nextOpeningDay, "YYYYMMDD");
		const today = moment();

		const date = today.isAfter(openingDay2017)
			? today
			: moment(lastEndingDay, "YYYYMMDD");

		return date;
	}

	public componentDidMount()
	{
		this.loadGamesForCurrentDate();

		/*this.linkHandlerSubscription = LinkHandler.Instance.stateChangeDistributor.subscribe(payload =>
		{
			if (payload.pathname.length < 2)
			{
				this.updateDate(GameList.getDateFromPath());
			}
		});*/
	}

	public componentWillUnmount()
	{
		if (this.linkHandlerSubscription)
		{
			LinkHandler.Instance.stateChangeDistributor.unsubscribe(this.linkHandlerSubscription);
		}
	}

	private loadGamesForCurrentDate()
	{
		App.startLoading();
		const summaries = GameSummaryCreator.getSummaryCollection(this.state.date);

		summaries.then((gameSummaryCollection: GameSummaryCollection) =>
		{
			if (gameSummaryCollection && gameSummaryCollection.games)
			{
				const games = gameSummaryCollection.games.game;

				this.setState({
					gameSummaries: games,
				});

				App.stopLoading();
			}
		});
	}

	private sortGames(games: GameSummaryData[])
	{
		const favoriteTeam = this.props.settings.favoriteTeam;
		games.sort((a, b) =>
		{
			const aIsFavorite = (a.home_file_code === favoriteTeam || a.away_file_code === favoriteTeam) ? -1 : 0;
			const bIsFavorite = (b.home_file_code === favoriteTeam || b.away_file_code === favoriteTeam) ? -1 : 0;
			const favoriteReturn = aIsFavorite - bIsFavorite;

			const startTimeReturn = a.dateObjLocal.isBefore(b.dateObjLocal) ? -1 : 1;

			const finalReturn = a.isFinal ? 1 : -1;

			return favoriteReturn || finalReturn || startTimeReturn;
		});
	}

	public render()
	{
		const gamesInProgress = this.state.gameSummaries.filter(a => !a.isFinal);
		const gamesFinal = this.state.gameSummaries.filter(a => a.isFinal);

		this.sortGames(gamesInProgress);
		this.sortGames(gamesFinal);

		const gamesInProgressRendered = gamesInProgress.map((gameSummary, i) =>
		{
			return <GameSummary game={gameSummary} index={i} key={i} hideScores={this.props.settings.hideScores}/>;
		});

		const finalGamesRendered = gamesFinal.map((gameSummary, i) =>
		{
			const key = gamesInProgress.length + i;
			return <GameSummary game={gameSummary} index={key} key={key} hideScores={this.props.settings.hideScores}/>;
		});

		const noGames = this.state.gameSummaries.length === 0 && !App.isLoading
			? <div className={`no-data`}>No games found for this date.</div>
			: null;

		const someFinalSomeNot = gamesInProgress.length > 0 && gamesFinal.length > 0;
		const navigatingClass = this.state.navigating ? "navigating" : "";

		return (
			<div className={`game-list-container ${navigatingClass}`}>
				<div className={`settings`}>
					<Calendar initialDate={this.state.date} onDateChange={this.updateDate}/>
				</div>

				<div className={`game-list`}>
					{gamesInProgressRendered}
				</div>

				{(someFinalSomeNot && !App.isLoading) &&
				<h2>Final</h2>
				}
				<div className={`game-list`}>
					{finalGamesRendered}
				</div>

				{noGames}
			</div>
		);
	}
}
