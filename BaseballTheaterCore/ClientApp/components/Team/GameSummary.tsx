import * as moment from "moment-timezone";
import * as React from "react";
import {Link} from "react-router-dom";
import {ISettings} from "../../DataStore/SettingsDispatcher";
import {App} from "../Base/app";
import {IScheduleGame} from "@MlbDataServer/Contracts/TeamSchedule";
import {Utility} from "@Utility/index";

interface GameSummaryProps
{
	game: IScheduleGame;
	includeDate?: boolean;
	hideScores: boolean;
}

interface IGameSummaryState
{
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
	private settingsDispatcherKey: string;

	constructor(props: GameSummaryProps)
	{
		super(props);

		this.state = {
			settings: App.Instance.settingsDispatcher.state
		};
	}

	public componentDidMount()
	{
		this.settingsDispatcherKey = App.Instance.settingsDispatcher.register(payload => this.setState({
			settings: payload
		}));
	}

	public componentWillUnmount()
	{
		App.Instance.settingsDispatcher.deregister(this.settingsDispatcherKey);
	}

	public render()
	{
		const game = this.props.game;

		const gameStatusClass = Utility.Mlb.gameIsFinal(this.props.game.status.statusCode) ? "final" : "";
		const gameDate = moment(game.gameDate);

		return (
			<div className={`game-summary-simple ${gameStatusClass}`} data-homecode={game.teams.home.team.fileCode} data-awaycode={game.teams.away.team.fileCode}>
				{this.props.includeDate &&
				<div className={`date`}>{gameDate.format("MMM Do")}</div>
				}
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
		const fileCode = teamType === HomeAway.Away ? game.teams.away.team.fileCode : game.teams.home.team.fileCode;
		const teamCity = teamType === HomeAway.Away ? game.teams.away.team.locationName : game.teams.home.team.locationName;
		const teamName = teamType === HomeAway.Away ? game.teams.away.team.teamName : game.teams.home.team.teamName;

		let linescoreRuns = 0;

		if (game.linescore)
		{
			linescoreRuns = teamType === HomeAway.Away
				? game.linescore.teams.away.runs
				: game.linescore.teams.home.runs;
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
		const date = moment(game.gameDate).format("YYYYMMDD");

		return `/game/${date}/${game.gamePk}`;
	}

	private linescoreItem(input: any): string
	{
		return this.props.hideScores
			? "▨"
			: input;
	}

	private getCurrentInning(): string
	{
		const game = this.props.game;

		if (Utility.Mlb.gameIsFinal(game.status.statusCode))
		{
			return game.status.detailedState;
		}

		return this.getStatusTime();
	}

	private getWinner(): HomeAway
	{
		const game = this.props.game;

		return game.teams.home.isWinner
			? HomeAway.Home
			: game.teams.away.isWinner
				? HomeAway.Away
				: HomeAway.None;
	}

	private getStatusTime()
	{
		const game = this.props.game;

		const date = moment(game.gameDate);
		const time = date.local().format("h:mm a");
		const timeZone = moment.tz(0, moment.tz.guess()).zoneAbbr();

		return `${time} ${timeZone}`;
	}
}
