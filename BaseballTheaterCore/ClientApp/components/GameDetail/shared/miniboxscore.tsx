import {BoxScoreData, ILinescoreInning} from "../../../MlbDataServer/Contracts";
import React = require("react");

interface IBoxScoreProps
{
	boxScoreData: BoxScoreData | null;
	hideScores: boolean;
}

export class MiniBoxScore extends React.Component<IBoxScoreProps, any>
{
	private renderTeamTable()
	{
		const boxScoreData = this.props.boxScoreData;
		if (boxScoreData)
		{
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

		return <div/>;
	}

	private renderInningsTable()
	{
		if (this.props.boxScoreData && this.props.boxScoreData.linescore)
		{
			const linescore = this.props.boxScoreData.linescore;
			const startingInning = linescore.startingInning;

			const innings: (ILinescoreInning | null)[] = [...linescore.inning_line_score];
			if (innings.length < 9)
			{
				const inningsLength = innings.length;
				for (let i = 0; i < (9 - inningsLength); i++)
				{
					innings.push(null)
				}
			}

			const inningsHeaders = innings.map((inning, i) =>
			{
				if (i >= startingInning)
				{
					return <td key={i} className={`single-val`}>{this.linescoreItem(i + 1)}</td>;
				}
			});

			const awayInnings = innings.map((inning, i) =>
			{
				if (i >= startingInning)
				{
					return inning
						? <td key={i} className={`single-val`}>{this.linescoreItem(inning.away)}</td>
						: <td key={i} className={`single-val`}>-</td>;
				}
			});

			const homeInnings = innings.map((inning, i) =>
			{
				if (i >= startingInning)
				{
					return inning
						? <td key={i} className={`single-val`}>{this.linescoreItem(inning.home)}</td>
						: <td key={i} className={`single-val`}>-</td>;
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

						<td className={`single-val r`}>{this.linescoreItem(linescore.away.r)}</td>
						<td className={`single-val h`}>{this.linescoreItem(linescore.away.h)}</td>
						<td className={`single-val e`}>{this.linescoreItem(linescore.away.e)}</td>
					</tr>
					<tr className={`home`}>
						{homeInnings}

						<td className={`single-val r`}>{this.linescoreItem(linescore.home.r)}</td>
						<td className={`single-val h`}>{this.linescoreItem(linescore.home.h)}</td>
						<td className={`single-val e`}>{this.linescoreItem(linescore.home.e)}</td>
					</tr>
					</tbody>
				</table>
			);
		}

		return (<div/>);
	}

	private linescoreItem(input: string | number): string | number
	{
		return this.props.hideScores
			? "▨"
			: input;
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
