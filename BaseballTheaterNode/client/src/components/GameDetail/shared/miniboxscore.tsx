import {LiveData} from "@MlbDataServer/Contracts";
import React = require("react");

interface IBoxScoreProps
{
	game: LiveData;
	hideScores: boolean;
}

export class MiniBoxScore extends React.Component<IBoxScoreProps, any>
{
	private renderTeamTable()
	{
		const game = this.props.game;
		if (game)
		{
			const awayTeamName = game.gameData.teams.away.name;
			const homeTeamName = game.gameData.teams.home.name;
			const awayTeamCode = game.gameData.teams.away.teamCode;
			const homeTeamCode = game.gameData.teams.home.teamCode;

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
		if (this.props.game && this.props.game.liveData && this.props.game.liveData.linescore)
		{
			const linescore = this.props.game.liveData.linescore;
			const startingInning = linescore.innings.length - 9;

			const innings = linescore.innings;
			
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
						? <td key={i} className={`single-val`}>{this.linescoreItem(inning.away.runs)}</td>
						: <td key={i} className={`single-val`}>-</td>;
				}
			});

			const homeInnings = innings.map((inning, i) =>
			{
				if (i >= startingInning)
				{
					return inning
						? <td key={i} className={`single-val`}>{this.linescoreItem(inning.home.runs)}</td>
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

						<td className={`single-val r`}>{this.linescoreItem(linescore.teams.away.runs)}</td>
						<td className={`single-val h`}>{this.linescoreItem(linescore.teams.away.hits)}</td>
						<td className={`single-val e`}>{this.linescoreItem(linescore.teams.away.errors)}</td>
					</tr>
					<tr className={`home`}>
						{homeInnings}

						<td className={`single-val r`}>{this.linescoreItem(linescore.teams.home.runs)}</td>
						<td className={`single-val h`}>{this.linescoreItem(linescore.teams.home.hits)}</td>
						<td className={`single-val e`}>{this.linescoreItem(linescore.teams.home.errors)}</td>
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
