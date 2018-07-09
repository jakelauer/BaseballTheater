import {Button, Icon} from "antd";
import * as moment from "moment/moment";
import * as React from "react";
import {RouteComponentProps} from "react-router";
import {Link} from "react-router-dom";
import {ISettings} from "../../DataStore/SettingsDispatcher";
import {GameSummaryCollection, GameSummaryData} from "../../MlbDataServer/Contracts";
import {GameSummaryCreator} from "../../MlbDataServer/MlbDataServer";
import {routes} from "../../routes";
import {App} from "../Base/app";
import {Calendar, CalendarTypes} from "./calendar";
import {GameSummary} from "./GameSummary";
import {ErrorBoundary} from "../Base/ErrorBoundary";

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
		}));
	}

	private static getUrlForDate(newDate: moment.Moment)
	{
		return `/gameday/${newDate.format("YYYYMMDD")}`;
	}

	private updateDate = (newDate: moment.Moment) => {
		const newUrl = GameList.getUrlForDate(newDate);

		this.props.history.push(newUrl);

		this.setState({
			date: newDate,
			gameSummaries: []
		}, () => this.loadGamesForCurrentDate());
	};

	public static getDefaultDate()
	{
		const lastEndingDay = "20171101";
		const nextOpeningDay = "20180223";

		const openingDay2017 = moment(nextOpeningDay, "YYYYMMDD");
		const today = moment();

		return today.isAfter(openingDay2017)
			? today
			: moment(lastEndingDay, "YYYYMMDD");
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

		summaries.then((gameSummaryCollection: GameSummaryCollection) => {
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
		games.sort((a, b) => {
			const aIsFavorite = (favoriteTeam.indexOf(a.home_file_code) > -1 || favoriteTeam.indexOf(a.away_file_code) > -1) ? -1 : 0;
			const bIsFavorite = (favoriteTeam.indexOf(b.home_file_code) > -1 || favoriteTeam.indexOf(b.away_file_code) > -1) ? -1 : 0;
			const favoriteReturn = aIsFavorite - bIsFavorite;

			const startTimeReturn = a.dateObjLocal.isBefore(b.dateObjLocal)
				? -1
				: a.dateObjLocal.isAfter(b.dateObjLocal)
					? 1
					: 0;

			const finalReturn = a.isFinal ? 1 : 0;

			return favoriteReturn || finalReturn || startTimeReturn;
		});
	}

	private renderSpecialHighlightLinks()
	{
		const games = this.state.gameSummaries;
		if (!games.some(a => a.isFinal))
		{
			return null;
		}

		const gameIds = this.state.gameSummaries.map(a => a.game_pk.toString()).join(",");

		return (
			<div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
				<Button.Group style={{}}>
					<Button>
						<Link to={`/search/recap/${gameIds}`}><Icon type="play-circle"/> Recaps</Link>
					</Button>
					<Button>
						<Link to={`/search/condensed/${gameIds}`}><Icon type="play-circle"/> Condensed Games</Link>
					</Button>
					<Button>
						<Link to={`/search/must c/${gameIds}`}><Icon type="play-circle"/> Must C clips</Link>
					</Button>
				</Button.Group>
			</div>
		);
	}

	public render()
	{
		const games = this.state.gameSummaries;

		this.sortGames(games);

		document.title = `Baseball Theater`;

		const gamesRendered = games.map((gameSummary, i) => {
			const key = games.length + i;
			return <GameSummary game={gameSummary} index={key} key={key} hideScores={this.state.settings.hideScores}/>;
		});

		const noGames = this.state.gameSummaries.length === 0 && !App.isLoading
			? <div className={`no-data`}>No games found for this date.</div>
			: null;

		const navigatingClass = this.state.navigating ? "navigating" : "";

		return (
			<div className={`game-list-container ${navigatingClass}`}>
				<div className={`settings`}>
					<Calendar 
						type={CalendarTypes.Day}
						initialDate={this.state.date} 
						onDateChange={this.updateDate}/>
				</div>

				{this.renderSpecialHighlightLinks()}

				<ErrorBoundary>
					<div className={`game-list`}>
						{gamesRendered}
					</div>
				</ErrorBoundary>

				{noGames}
			</div>
		);
	}
}
