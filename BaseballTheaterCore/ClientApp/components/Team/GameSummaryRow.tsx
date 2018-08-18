import * as moment from "moment-timezone";
import * as React from "react";
import {Link} from "react-router-dom";
import {ISettings} from "../../DataStore/SettingsDispatcher";
import {App} from "../Base/app";
import {IScheduleGame, IScheduleTeamItem} from "@MlbDataServer/Contracts/TeamSchedule";
import {Utility} from "@Utility/index";

interface GameSummaryRowProps
{
	focusedTeamCode: string;
	game: IScheduleGame;
	hideScores: boolean;
}

interface IGameSummaryRowState
{
	settings: ISettings,
}

enum HomeAway
{
	None,
	Home,
	Away
}

export class GameSummaryRow extends React.Component<GameSummaryRowProps, IGameSummaryRowState>
{
	private settingsDispatcherKey: string;

	constructor(props: GameSummaryRowProps)
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
		const isFinal = Utility.Mlb.gameIsFinal(game.status.statusCode);
		const isStarted = game.linescore && game.linescore.innings && game.linescore.innings.length > 0;

		const gameStatusClass = Utility.Mlb.gameIsFinal(this.props.game.status.statusCode) ? "final" : "";
		const gameDate = moment(game.gameDate);

		const winner: IScheduleTeamItem = game.teams.home.score > game.teams.away.score
			? game.teams.home
			: game.teams.away;
		const loser: IScheduleTeamItem = game.teams.home.score > game.teams.away.score
			? game.teams.away
			: game.teams.home;

		const score = `${winner.score} - ${loser.score}`;

		const focusedTeam = game.teams.home.team.fileCode === this.props.focusedTeamCode ? game.teams.home : game.teams.away;
		const focusedTeamWon = winner.team.fileCode === focusedTeam.team.fileCode;

		const winClass = focusedTeamWon ? "win" : "loss";
		const winLoss = focusedTeamWon ? "W" : "L";

		return (
			<div className={`game-summary-row ${gameStatusClass}`}>
				<Link to={this.getGameLink()} className={`date`}>
					{gameDate.format("M/D")}
				</Link>

				{this.renderOpponent()}


				<div className={`winner`}>
					{game.decisions &&
					<span>W: {Utility.Mlb.renderPlayerLink(game.decisions.winner)}</span>
					}
				</div>

				<div className={`loser`}>
					{game.decisions &&
					<span>L: {Utility.Mlb.renderPlayerLink(game.decisions.loser)}</span>
					}
				</div>

				<div className={`record`}>
					{isFinal &&
					<React.Fragment>
						{focusedTeam.leagueRecord.wins} - {focusedTeam.leagueRecord.losses}
					</React.Fragment>
					}
				</div>

				<div className={`score`}>
					{isStarted &&
					<span>
						<span className={`win-loss ${winClass}`}>
							{isFinal && winLoss}
						</span>
						<span className="score-number">{score}</span>
					</span>
					}
				</div>

				<div className={`inning-status`}>
					<span>{this.getCurrentInning()}</span>
				</div>
			</div>
		);
	}

	private renderOpponent()
	{
		const game = this.props.game;

		const teamType = game.teams.home.team.fileCode === this.props.focusedTeamCode
			? HomeAway.Away
			: HomeAway.Home;

		const teamName = teamType === HomeAway.Away
			? game.teams.away.team.name
			: game.teams.home.team.name;

		const teamCode = teamType === HomeAway.Away
			? game.teams.away.team.fileCode
			: game.teams.home.team.fileCode;

		const vsType = teamType === HomeAway.Home ? "@" : "vs";

		return (
			<React.Fragment>
				<div className={`opponent-name`}>
					{vsType} <Link to={`/team/${teamCode}`}>{teamName}</Link>
				</div>
			</React.Fragment>
		);
	}

	private getGameLink(): string
	{
		const game = this.props.game;
		const date = moment(game.gameDate).format("YYYYMMDD");

		return `/game/${date}/${game.gamePk}`;
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

	private getStatusTime()
	{
		const game = this.props.game;

		const date = moment(game.gameDate);
		const time = date.local().format("h:mma");
		const timeZone = moment.tz(0, moment.tz.guess()).zoneAbbr();

		return `${time} ${timeZone}`;
	}
}
