namespace Theater
{
	interface GameSummaryProps
	{
		game: GameSummaryData;
	}

	enum HomeAway
	{
		Home,
		Away
	}

	export class GameSummary extends React.Component<GameSummaryProps, any>
	{
		constructor(props: GameSummaryProps)
		{
			super(props);
		}

		public render()
		{
			const game = this.props.game;

			const gameStatusClass = game.status.ind === "F" || game.status.ind === "O" ? "final" : "";

			return (
				<div className={`game-summary-simple ${gameStatusClass}`} data-homecode={game.home_file_code} data-awaycode={game.away_file_code}>
					<a href={this.getGameLink()} className={`game-link`}></a>

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

			const winnerClass = this.getWinner() === teamType ? "winner" : "";
			const homeAwayClass = teamType === HomeAway.Away ? "away-team" : "home-team";
			const fileCode = teamType === HomeAway.Away ? game.away_file_code : game.home_file_code;
			const teamCity = teamType === HomeAway.Away ? game.away_team_city : game.home_team_city;
			const teamName = teamType === HomeAway.Away ? game.away_team_name : game.home_team_name;

			let linescoreRuns = "";

			if (game.linescore)
			{
				linescoreRuns = teamType === HomeAway.Away ? game.linescore.r.away : game.linescore.r.home;
			}

			return (
				<div className={`team-row ${homeAwayClass} ${winnerClass}`}>
					<div className={`team-info`}>
						<div className={`team-city team-color ${fileCode}`}>{teamCity}</div>
						<div className={`team-name team-color ${fileCode}`}>{teamName}</div>
					</div>
					{game.linescore &&
						<div className={`score`}>
							{this.linescoreItem(linescoreRuns)}
						</div>
					}
				</div>
			);
		}

		private getGameLink(): string
		{
			const game = this.props.game;

			const dayString = game.dateObj.local().format("YYYYMMDD");
			return `/game/${dayString}/${game.game_pk}`;
		}

		private linescoreItem(input: string): string
		{
			return input;
		}

		private getCurrentInning(): string
		{
			const game = this.props.game;

			if (game.status.ind === "F")
			{
				return game.status.status;
			}

			if (game.status.reason)
			{
				return `${game.status.status} (${game.status.reason})`;
			}

			return game.status.inning_state
				       ? `${game.status.inning_state} ${game.status.inning}`
				       : this.getStatusTime();
		}

		private getWinner(): HomeAway
		{
			return HomeAway.Away;
		}

		private getStatusTime()
		{
			const game = this.props.game;

			var time = game.dateObj.local().format("h:mm a");
			var timeZone = moment.tz(0, moment.tz.guess()).zoneAbbr();

			return `${time} ${timeZone}`;
		}
	}
}