import * as moment from "moment/moment"
import * as React from "react"
import {RouteComponentProps} from "react-router";
import {ISettings} from "../../DataStore/SettingsDispatcher";
import {GameSummaryCollection, GameSummaryData} from "../../MlbDataServer/Contracts";
import {GameSummaryCreator} from "../../MlbDataServer/game_summary_creator";
import {Subscription} from "../../Utility/subscribable";
import {App} from "../Base/app";
import {Calendar} from "./calendar";
import {GameSummary} from "./game_summary";

interface IGameListState
{
	gameSummaries: GameSummaryData[];
	date: moment.Moment;
	navigating: boolean;
	settings: ISettings;
}

interface IGameListRouteParams
{
	date: string;
}

export class GameList extends React.Component<RouteComponentProps<IGameListRouteParams>, IGameListState>
{
	private settingsDispatcherKey: string;

	constructor(props: RouteComponentProps<IGameListRouteParams>)
	{
		super(props);

		let date: moment.Moment;
		const dateString = this.props.match.params.date;
		if (dateString)
		{
			date = moment(dateString, "YYYYMMDD");
		}

		if (!date || !date.isValid())
		{
			date = GameList.getDefaultDate();
		}

		this.state = {
			gameSummaries: [],
			date,
			navigating: false,
			settings: App.Instance.settingsDispatcher.state
		};
	}

	public componentWillMount()
	{
		this.settingsDispatcherKey = App.Instance.settingsDispatcher.register(payload => this.setState({
			settings: payload
		}))
	}

	private getUrlForDate(newDate: moment.Moment)
	{
		return `/gameday/${newDate.format("YYYYMMDD")}`;
	}

	private updateDate = (newDate: moment.Moment) =>
	{
		const newUrl = this.getUrlForDate(newDate);

		this.props.history.push(newUrl);

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
	}

	public componentWillUnmount()
	{
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
		const favoriteTeam = this.state.settings.favoriteTeam;
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
		const games = this.state.gameSummaries;

		this.sortGames(games);
		
		const gamesRendered = games.map((gameSummary, i) =>
		{
			const key = games.length + i;
			return <GameSummary game={gameSummary} index={key} key={key} hideScores={this.state.settings.hideScores}/>;
		});

		const noGames = this.state.gameSummaries.length === 0
			? <div className={`no-data`}>No games found for this date.</div>
			: null;

		const navigatingClass = this.state.navigating ? "navigating" : "";

		return (
			<div className={`game-list-container ${navigatingClass}`}>
				<div className={`settings`}>
					<Calendar initialDate={this.state.date} onDateChange={this.updateDate}/>
				</div>

				<div className={`game-list`}>
					{gamesRendered}
				</div>

				{noGames}
			</div>
		);
	}
}
