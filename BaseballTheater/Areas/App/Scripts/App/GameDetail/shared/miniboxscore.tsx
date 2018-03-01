namespace Theater.GameDetail
{
	interface IBoxScoreProps
	{
		boxScoreData: BoxScoreData;
	}

	export class MiniBoxScore extends React.Component<IBoxScoreProps, any>
	{
		private renderTeamTable()
		{
			const boxScoreData = this.props.boxScoreData;
			const awayTeamName = boxScoreData.away_sname;
			const homeTeamName = boxScoreData.home_sname;
			const awayTeamCode = boxScoreData.away_team_code;
			const homeTeamCode = boxScoreData.home_team_code;

			return (
				<table>
					<tbody>
					<tr>
						<td>&nbsp;</td>
					</tr>
					<tr className={`away`}>
						<td>
							<div className={`team-info small`}>
								<div className={`team-city team-color ${awayTeamCode}`}>{awayTeamName}</div>
							</div>
						</td>
					</tr>
					<tr className={`home`}>
						<td>
							<div className={`team-info small`}>
								<div className={`team-city team-color ${homeTeamCode}`}>{homeTeamName}</div>
							</div>
						</td>
					</tr>
					</tbody>
				</table>
			);
		}

		private renderInningsTable()
		{
			if (this.props.boxScoreData && this.props.boxScoreData.linescore)
			{
				const linescore = this.props.boxScoreData.linescore;
				const startingInning = linescore.startingInning;

				const inningsHeaders = linescore.inning_line_score.map((inning, i) =>
				{
					if (i >= startingInning)
					{
						return <td key={i} className={`single-val`}>{i + 1}</td>;
					}
				});

				const awayInnings = linescore.inning_line_score.map((inning, i) =>
				{
					if (i >= startingInning)
					{
						return <td key={i} className={`single-val`}>{inning.away}</td>;
					}
				});

				const homeInnings = linescore.inning_line_score.map((inning, i) =>
				{
					if (i >= startingInning)
					{
						return <td key={i} className={`single-val`}>{inning.home}</td>;
					}
				});

				return (
					<table>
						<tbody>
							<tr className={`headers`}>
								{inningsHeaders}

								<td className={`single-val r`}>R</td>
								<td className={`single-val h`}>H</td>
								<td className={`single-val e`}>E</td>
							</tr>
							<tr className={`away`}>
								{awayInnings}

								<td className={`single-val r`}>{linescore.away.r}</td>
								<td className={`single-val h`}>{linescore.away.h}</td>
								<td className={`single-val e`}>{linescore.away.e}</td>
							</tr>
							<tr className={`home`}>
								{homeInnings}

								<td className={`single-val r`}>{linescore.home.r}</td>
								<td className={`single-val h`}>{linescore.home.h}</td>
								<td className={`single-val e`}>{linescore.home.e}</td>
							</tr>
						</tbody>
					</table>
				);
			}

			return (<div />);
		}
		
		public render()
		{
			return (
				<div className={`mini-box-score`}>
					<div className={`team-table`}>
						{this.renderTeamTable()}
					</div>
					<div className={`innings-table`}>
						{this.renderInningsTable()}
					</div>
				</div>
			);
		}
	}
}