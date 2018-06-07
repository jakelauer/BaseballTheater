import * as moment from "moment-timezone"
import * as React from "react"
import {Link} from "react-router-dom";
import {ISettings} from "../../DataStore/SettingsDispatcher";
import {GameSummaryData} from "../../MlbDataServer/Contracts";
import {Subscription} from "../../Utility/subscribable";
import {App, ILoadingPayload} from "../Base/app";

interface GameSummaryProps
{
	game: GameSummaryData;
	index: number;
	hideScores: boolean;
}

interface IGameSummaryState
{
	visible: boolean,
	settings: ISettings,
}

enum HomeAway
{
	None,
	Home,
	Away
}

export class GameSummary extends React.Component<GameSummaryProps, IGameSummaryState>
{
	private loadingSubscription: Subscription<ILoadingPayload>;
	private settingsDispatcherKey: string;

	constructor(props: GameSummaryProps)
	{
		super(props);

		this.state = {
			visible: false,
			settings: App.Instance.settingsDispatcher.state
		};
	}

	private show()
	{
		this.setState({
			visible: true
		})
	}

	public componentDidMount()
	{
		setTimeout(() => this.show(), this.props.index * 25);

		this.loadingSubscription = App.Instance.loadingDistributor.subscribe(() =>
			this.setState({
				visible: false
			})
		);

		this.settingsDispatcherKey = App.Instance.settingsDispatcher.register(payload => this.setState({
			settings: payload
		}))
	}

	public componentWillUnmount()
	{
		App.Instance.loadingDistributor.unsubscribe(this.loadingSubscription);
		App.Instance.settingsDispatcher.deregister(this.settingsDispatcherKey);
	}

	public componentWillReceiveProps(newProps: Readonly<GameSummaryProps>)
	{
		if (this.props.game.game_pk !== newProps.game.game_pk)
		{
			setTimeout(() => this.show(), this.props.index * 25);
		}
	}

	public render()
	{
		const game = this.props.game;

		const gameStatusClass = game.isFinal ? "final" : "";
		const visibleClass = this.state.visible ? "on" : "";


		return (
			<div className={`game-summary-simple ${gameStatusClass} ${visibleClass}`} data-homecode={game.home_file_code} data-awaycode={game.away_file_code}>
				<Link to={this.getGameLink()} className={`game-link`}>
					<i className="material-icons">keyboard_arrow_right</i>
				</Link>

				{this.renderTeamRow(HomeAway.Away)}

				<div className={`inning-status`}>
					<span>{this.getCurrentInning()}</span>
				</div>

				{this.renderTeamRow(HomeAway.Home)}
			</div>
		);
	}

	private renderTeamRow(teamType: HomeAway)
	{
		const game = this.props.game;

		const isWinner = this.getWinner() === teamType;
		const winnerClass = isWinner ? "winner" : "";
		const homeAwayClass = teamType === HomeAway.Away ? "away-team" : "home-team";
		const fileCode = teamType === HomeAway.Away ? game.away_file_code : game.home_file_code;
		const teamCity = teamType === HomeAway.Away ? game.away_team_city : game.home_team_city;
		const teamName = teamType === HomeAway.Away ? game.away_team_name : game.home_team_name;

		let linescoreRuns = "";

		if (game.linescore)
		{
			linescoreRuns = teamType === HomeAway.Away ? game.linescore.r.away : game.linescore.r.home;
		}

		const isFavoriteTeam = this.state.settings.favoriteTeam.indexOf(fileCode) > -1;
		const favClass = this.state.settings.favoriteTeam.indexOf(fileCode) > -1 ? "is-favorite" : "";

		return (
			<div className={`team-row ${homeAwayClass} ${winnerClass}`}>
				<div className={`team-info ${favClass}`}>
					{isFavoriteTeam &&
						<div className={`favorite-team`}>
						</div>
					}
					<div className={`team-city team-color ${fileCode}`}>{teamCity}</div>
					<div className={`team-name team-color ${fileCode}`}>{teamName}</div>
				</div>
				{game.linescore &&
				<div className={`score`}>
					{this.linescoreItem(linescoreRuns)}
					<span className={`winner-indicator ${winnerClass}`}>
								<i className={`material-icons`}>chevron_left</i>
							</span>
				</div>
				}
			</div>
		);
	}

	private getGameLink(): string
	{
		const game = this.props.game;

		return `/game/${game.urlDate}/${game.game_pk}`;
	}

	private linescoreItem(input: string): string
	{
		return this.props.hideScores
			? "▨"
			: input;
	}

	private getCurrentInning(): string
	{
		const game = this.props.game;

		/*	if (game.status.note){
				return game.status.note;
			}*/

		if (game.isFinal)
		{
			const tieString = game.status.ind === "FT" ? " (Tie)" : "";
			return game.status.status + tieString;
		}

		if (game.status.reason)
		{
			return `${game.status.status} (${game.status.reason})`;
		}

		if (game.status.inning_state)
		{
			if (game.status.inning)
			{
				return `${game.status.inning_state} ${game.status.inning}`;
			}

			return game.status.status;
		}

		return this.getStatusTime();
	}

	private getWinner(): HomeAway
	{
		const game = this.props.game;

		if (game.linescore && game.linescore.r && !this.props.hideScores && game.isFinal)
		{
			const away = parseInt(game.linescore.r.away);
			const home = parseInt(game.linescore.r.home);
			if (away !== home)
			{
				return parseInt(game.linescore.r.away) > parseInt(game.linescore.r.home)
					? HomeAway.Away
					: HomeAway.Home;
			}
		}

		return HomeAway.None;
	}

	private getStatusTime()
	{
		const game = this.props.game;

		var time = game.dateObj.local().format("h:mm a");
		var timeZone = moment.tz(0, moment.tz.guess()).zoneAbbr();

		return `${time} ${timeZone}`;
	}
}
