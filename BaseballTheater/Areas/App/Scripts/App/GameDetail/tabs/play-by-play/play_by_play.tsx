namespace Theater.GameDetail
{
	type HalfInningType = "top" | "bottom";

	interface IPlayByPlayProps
	{
		gameSummary: GameSummaryData | null;
		inningsData: IInningsContainer | null;
		allPlayers: Map<string, IBatter | IPitcher>;
		highlights: IHighlightsCollection | null;
	}

	export class PlayByPlay extends React.Component<IPlayByPlayProps, any>
	{
		private renderHalfInning(halfInning: IInningHalf, halfInningType: HalfInningType, inningIndex: number)
		{
			const gameSummary = this.props.gameSummary;
			const players = this.props.allPlayers;

			if (gameSummary && players && halfInning && halfInning.atbat)
			{
				const isSpringTraining = gameSummary.isSpringTraining;

				let oldPitcherData: IPitcher | null = null;
				const batters = halfInning.atbat.map((batter, i) =>
				{
					const newPitcherData = players.get(batter.pitcher) as IPitcher;

					const rendered = <Batter highlights={this.props.highlights} isSpringTraining={isSpringTraining} batter={batter} batterIndex={i} oldPitcher={oldPitcherData} newPitcher={newPitcherData} />;

					oldPitcherData = players.get(batter.pitcher) as IPitcher;

					return rendered;
				});

				const inningHalfLabel = halfInningType === "top" ? "Top" : "Bottom";
				const inningLabel = `${inningHalfLabel} ${inningIndex + 1}`;

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

		private renderInning(inning: IInning, inningIndex: number)
		{
			return (
				<div className={`inning`} key={inningIndex}>
					{this.renderHalfInning(inning.top, "top", inningIndex)}
					{this.renderHalfInning(inning.bottom, "bottom", inningIndex)}
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
				inningsRendered = inningsData.game.inning.map((inning, i) =>
				{
					return this.renderInning(inning, i);
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
}