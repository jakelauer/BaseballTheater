import {GameSummaryData, IAtBat, IBatter, IInning, IInningHalf, IInningsContainer, IPitcher} from "../../../MlbDataServer/Contracts";
import React = require("react");
import {Batter} from "./batter";

type HalfInningType = "top" | "bottom";

interface IPlayByPlayProps
{
	gameSummary: GameSummaryData | null;
	inningsData: IInningsContainer | null;
	allPlayers: Map<string, IBatter | IPitcher>;
	gameMedia: GameMedia | null;
}

export class PlayByPlay extends React.Component<IPlayByPlayProps, any>
{
	private renderHalfInning(halfInning: IInningHalf, halfInningType: HalfInningType, inningNum: number)
	{
		const gameSummary = this.props.gameSummary;
		const players = this.props.allPlayers;

		if (gameSummary && players && halfInning && halfInning.atbat)
		{
			const isSpringTraining = gameSummary.isSpringTraining;

			const atBat = halfInning.atbat instanceof Array ? halfInning.atbat : [(halfInning.atbat as any) as IAtBat];

			let oldPitcherData: IPitcher | null = null;
			const batters = [...atBat].map((batter, i) =>
			{
				const newPitcherData = players.get(batter.pitcher) as IPitcher;

				const rendered =
					<Batter
						key={i}
						gameMedia={this.props.gameMedia}
						isSpringTraining={isSpringTraining}
						batter={batter}
						batterIndex={i}
						oldPitcher={oldPitcherData}
						newPitcher={newPitcherData}/>;

				oldPitcherData = players.get(batter.pitcher) as IPitcher;

				return rendered;
			});

			const inningHalfLabel = halfInningType === "top" ? "Top" : "Bottom";
			const inningLabel = `${inningHalfLabel} ${inningNum}`;

			return (
				<div className={`half-inning ${halfInningType}`}>
					<div className={`inning-label`}>{inningLabel}</div>
					<div className={`batters`}>
						{batters}
					</div>
				</div>
			);
		}

		return (<div/>);
	}

	private renderInning(inning: IInning)
	{
		const inningNum = parseInt(inning.num);

		return (
			<div className={`inning`} key={inningNum}>
				{this.renderHalfInning(inning.bottom, "bottom", inningNum)}
				{this.renderHalfInning(inning.top, "top", inningNum)}
			</div>
		);
	}

	private renderInnings()
	{
		let inningsRendered: JSX.Element[] = [];
		const inningsData = this.props.inningsData;

		if (!inningsData)
		{
			return <div/>;
		}

		if (inningsData.game
			&& inningsData.game
			&& inningsData.game.inning
			&& inningsData.game.inning.length > 0)
		{
			const inningsSorted = [...inningsData.game.inning].reverse();

			inningsRendered = inningsSorted.map((inning, i) =>
			{
				return this.renderInning(inning);
			});
		}

		return inningsRendered;
	}

	public render()
	{
		return (
			<div className={`play-by-play-container`}>
				{this.renderInnings()}
			</div>
		);
	}
}