import React from "react";
import {LiveData} from "baseball-theater-engine";
import styles from "./MiniBoxScore.module.scss";
import classNames from "classnames";
import {ISettingsDataStorePayload, SettingsDataStore} from "../../../Global/Settings/SettingsDataStore";

interface IBoxScoreProps
{
	game: LiveData;
}

interface IBoxScoreState
{
	settings: ISettingsDataStorePayload;
}

export class MiniBoxScore extends React.Component<IBoxScoreProps, IBoxScoreState>
{
	constructor(props: IBoxScoreProps)
	{
		super(props);

		this.state = {
			settings: SettingsDataStore.state
		};
	}

	public componentDidMount(): void
	{
		SettingsDataStore.listen(settings => this.setState({
			settings
		}));
	}

	private renderTeamTable()
	{
		const game = this.props.game;
		if (game)
		{
			const awayTeamName = game.gameData.teams.away.shortName;
			const homeTeamName = game.gameData.teams.home.shortName;
			const awayTeamCode = game.gameData.teams.away.teamCode;
			const homeTeamCode = game.gameData.teams.home.teamCode;

			return (
				<table>
					<tbody>
					<tr>
						<td>&nbsp;</td>
					</tr>
					<tr className={styles.away}>
						<td>
							<div className={classNames(styles.teamInfo, styles.small)}>
								<div className={classNames(styles.teamCity, styles.teamColorPrimary, styles[awayTeamCode])}>{awayTeamName}</div>
							</div>
						</td>
					</tr>
					<tr className={styles.home}>
						<td>
							<div className={classNames(styles.teamInfo, styles.small)}>
								<div className={classNames(styles.teamCity, styles.teamColorPrimary, styles[homeTeamCode])}>{homeTeamName}</div>
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
					return <td key={i} className={styles.singleVal}>{this.linescoreItem(i + 1)}</td>;
				}
			});

			const awayInnings = innings.map((inning, i) =>
			{
				if (i >= startingInning)
				{
					return inning
						? <td key={i} className={styles.singleVal}>{this.linescoreItem(inning.away.runs)}</td>
						: <td key={i} className={styles.singleVal}>-</td>;
				}
			});

			const homeInnings = innings.map((inning, i) =>
			{
				if (i >= startingInning)
				{
					return inning
						? <td key={i} className={styles.singleVal}>{this.linescoreItem(inning.home.runs)}</td>
						: <td key={i} className={styles.singleVal}>-</td>;
				}
			});

			return (
				<table>
					<tbody>
					<tr className={styles.headers}>
						{inningsHeaders}

						<td className={classNames(styles.singleVal, styles.r)}>R</td>
						<td className={classNames(styles.singleVal, styles.h)}>H</td>
						<td className={classNames(styles.singleVal, styles.e)}>E</td>
					</tr>
					<tr className={styles.away}>
						{awayInnings}

						<td className={classNames(styles.singleVal, styles.r)}>{this.linescoreItem(linescore.teams.away.runs)}</td>
						<td className={classNames(styles.singleVal, styles.h)}>{this.linescoreItem(linescore.teams.away.hits)}</td>
						<td className={classNames(styles.singleVal, styles.e)}>{this.linescoreItem(linescore.teams.away.errors)}</td>
					</tr>
					<tr className={styles.home}>
						{homeInnings}

						<td className={classNames(styles.singleVal, styles.r)}>{this.linescoreItem(linescore.teams.home.runs)}</td>
						<td className={classNames(styles.singleVal, styles.h)}>{this.linescoreItem(linescore.teams.home.hits)}</td>
						<td className={classNames(styles.singleVal, styles.e)}>{this.linescoreItem(linescore.teams.home.errors)}</td>
					</tr>
					</tbody>
				</table>
			);
		}

		return (<div/>);
	}

	private linescoreItem(input: string | number): string | number
	{
		return this.state.settings.hideScores
			? "▨"
			: input;
	}

	public render()
	{
		return (
			<div className={styles.miniBoxScore}>
				<div className={styles.teamTable}>
					{this.renderTeamTable()}
				</div>
				<div className={styles.inningsTable}>
					{this.renderInningsTable()}
				</div>
			</div>
		);
	}
}