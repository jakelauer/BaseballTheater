namespace Theater
{
	interface IBoxScoreProps
	{
		boxScoreData: BoxScoreData;
	}

	export class BoxScore extends React.Component<IBoxScoreProps, any>
	{
		private getIP(outs: number)
		{
			const fullIP = Math.floor(outs / 3);
			const remainingOuts = outs - (fullIP * 3);
			return `${fullIP}.${remainingOuts}`;
		};

		private markup(value: string)
		{
			return { __html: value };
		}

		public render()
		{
			const boxScore = this.props.boxScoreData;

			return (
				<div className={`boxscore`} data-homecode={boxScore.home_team_code} data-awaycode={boxScore.away_team_code}>
					<div className={`teams`}>
						<div className={`team away`}>
							<table className={`player-list batters`}>
								<tbody>
								{this.renderBatterHeaders()}
								{this.renderBatterStats(HomeAway.Away)}
								</tbody>
							</table>
							<div className={`note`} dangerouslySetInnerHTML={this.markup(boxScore.batting_away.note)}></div>
							<table className={`player-list pitchers`}>
								<tbody>
								{this.renderPitcherHeaders()}
								{this.renderPitcherStats(HomeAway.Away)}
								</tbody>
							</table>
							<div className={`note`} dangerouslySetInnerHTML={this.markup(boxScore.pitching_away.note)}></div>
						</div>
						<div className={`team home`}>
							<table className={`player-list batters`}>
								<tbody>
								{this.renderBatterHeaders()}
								{this.renderBatterStats(HomeAway.Home)}
								</tbody>
							</table>
							<div className={`note`} dangerouslySetInnerHTML={this.markup(boxScore.batting_home.note)}></div>
							<table className={`player-list pitchers`}>
								<tbody>
								{this.renderPitcherHeaders()}
								{this.renderPitcherStats(HomeAway.Home)}
								</tbody>
							</table >
							<div className={`note`} dangerouslySetInnerHTML={this.markup(boxScore.pitching_home.note)}></div>
						</div>
					</div>
				</div>
			);
		}

		private renderBatterHeaders()
		{
			return (
				<tr className={`player-item batter-item header`}>
					<td className={`player-name`}>Player (Position)</td>
					<td className={`stat`} data-statid="ab">AB</td>
					<td className={`stat`} data-statid="r">R</td>
					<td className={`stat`} data-statid="h">H</td>
					<td className={`stat`} data-statid="rbi">RBI</td>
					<td className={`stat`} data-statid="bb">BB</td>
					<td className={`stat`} data-statid="so">SO</td>
					<td className={`stat`} data-statid="avg">AVG</td>
					<td className={`stat`} data-statid="obp">OBP</td>
					<td className={`stat`} data-statid="slg">SLG</td>
				</tr>
			);
		}

		private renderPitcherHeaders()
		{
			return (
				<tr className={`player-item batter-item header`}>
					<td className={`player-name`}>Pitcher (Position)</td>
					<td className={`stat`} data-statid="ip">IP</td>
					<td className={`stat`} data-statid="h">H</td>
					<td className={`stat`} data-statid="r">R</td>
					<td className={`stat`} data-statid="er">ER</td>
					<td className={`stat`} data-statid="bb">BB</td>
					<td className={`stat`} data-statid="so">K</td>
					<td className={`stat`} data-statid="hr">HR</td>
					<td className={`stat`} data-statid="p-st">P-ST</td>
					<td className={`stat`} data-statid="era">ERA</td>
				</tr>
			);
		}

		private renderPitcherStats(teamType: HomeAway)
		{
			const boxScore = this.props.boxScoreData;
			const pitchers = teamType === HomeAway.Away
				                 ? boxScore.pitching_away.pitcher
				                 : boxScore.pitching_home.pitcher;

			const pitcherRows = pitchers.map((pitcher, i) =>
			{
				return (
					<tr className={`player-item pitcher-item`} key={i}>
						<td className={`player-name`}>
							{pitcher.note &&
								<span className={`note`} dangerouslySetInnerHTML={{ __html: pitcher.note }}></span>
							}
							{pitcher.name} ({pitcher.pos})
						</td>
						<td className={`stat`} data-statid="ip">{this.getIP(pitcher.out)}</td>
						<td className={`stat`} data-statid="h">{pitcher.h}</td>
						<td className={`stat`} data-statid="r">{pitcher.r}</td>
						<td className={`stat`} data-statid="er">{pitcher.er}</td>
						<td className={`stat`} data-statid="bb">{pitcher.bb}</td>
						<td className={`stat`} data-statid="so">{pitcher.so}</td>
						<td className={`stat`} data-statid="hr">{pitcher.hr}</td>
						<td className={`stat`} data-statid="p-st">{pitcher.np}-{pitcher.s}</td>
						<td className={`stat`} data-statid="era">{pitcher.era}</td>
					</tr>
				);
			});

			return pitcherRows;
		}

		private renderBatterStats(teamType: HomeAway)
		{
			const boxScore = this.props.boxScoreData;
			const batters = teamType === HomeAway.Away
				                ? boxScore.batting_away.batter
				                : boxScore.batting_home.batter;

			const batterRows = batters.map((batter, i) =>
			{
				return (
					<tr className={`player-item batter-item`} key={i}>
						<td className={`player-name`}>
							{batter.note &&
								<span className={`note`} dangerouslySetInnerHTML={{ __html: batter.note }}></span>
							}
							{batter.name} ({batter.pos})
						</td>
						<td className={`stat`} data-statid="ab">{batter.ab}</td>
						<td className={`stat`} data-statid="r">{batter.r}</td>
						<td className={`stat`} data-statid="h">{batter.h}</td>
						<td className={`stat`} data-statid="rbi">{batter.rbi}</td>
						<td className={`stat`} data-statid="bb">{batter.bb}</td>
						<td className={`stat`} data-statid="so">{batter.so}</td>
						<td className={`stat`} data-statid="avg">{batter.avg}</td>
						<td className={`stat`} data-statid="obp">{batter.obp}</td>
						<td className={`stat`} data-statid="slg">{batter.slg}</td>
					</tr>
				);
			});

			return batterRows;
		}
	}
}