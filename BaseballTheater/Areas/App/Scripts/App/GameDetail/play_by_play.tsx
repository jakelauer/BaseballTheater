namespace Theater.GameDetail
{
	type HalfInningType = "top" | "bottom";

	interface IPlayByPlayProps
	{
		inningsData: IInningsContainer;
	}

	interface IPlayByPlayState
	{
		expandedBatters: number[];
	}

	export class PlayByPlay extends React.Component<IPlayByPlayProps, IPlayByPlayState>
	{
		constructor(props: IPlayByPlayProps)
		{
			super(props);

			this.state = {
				expandedBatters: []
			}
		}

		private toggleBatter(batter: IAtBat)
		{
			const expandedBatters = [...this.state.expandedBatters];
			const existingIndex = this.state.expandedBatters.indexOf(batter.num);
			if (existingIndex > -1)
			{
				expandedBatters.splice(existingIndex, 1);
			}
			else
			{
				expandedBatters.push(batter.num);
			}

			this.setState({
				expandedBatters
			});
		}

		private renderPitch(pitch: IPitch, pitchIndex: number)
		{
			return (
				<div className={`pitch`} key={pitchIndex} data-type={pitch.type}>
					<div className={`pitch-count`}>{pitchIndex + 1}</div>
					<div className={`pitch-description`}>{pitch.des}</div>
					<div className={`pitch-details`}>
						{pitch.start_speed} MPH {pitch.pitch_type_detail}
					</div>
				</div>
			);
		}

		private renderStrikezone(pitches: IPitch[])
		{
			const maxY = 250;
			const minY = 100;
			const maxX = 250;
			const minX = 15;

			const pitchesRendered = pitches.map((pitch, i) =>
			{
				const pitchX = parseFloat(pitch.x);
				const pitchY = parseFloat(pitch.y);

				const leftPct = ((maxX - pitchX - minX)) / (maxX - minX);
				const topPct = (pitchY - minY) / (maxY - minY);

				const style = {
					left: `${leftPct * 100}%`,
					top: `${topPct * 100}%`,
					zIndex: i + 1
				}

				return (
					<div className={`pitch`} style={style} key={i} data-type={pitch.type}>
						<span className={`pitch-count`}>{i + 1}</span>
					</div>
				);
			});

			return (
				<div className={`strikezone`}>
					<div className={`force-square`}></div>
					{pitchesRendered}
					<div className={`actual-strikezone`}></div>
				</div>
			);
		}

		private renderBatter(batter: IAtBat, batterIndex: number)
		{
			let pitches: JSX.Element[] = [];
			let strikezone: JSX.Element = <div/>;
			if (batter.pitch)
			{
				pitches = batter.pitch.map((pitch, i) =>
				{
					return this.renderPitch(pitch, i);
				});

				strikezone = this.renderStrikezone(batter.pitch);
			}

			const onClickBatter = () => this.toggleBatter(batter);
			const expandedClass = this.state.expandedBatters.indexOf(batter.num) > -1 ? "expanded" : "";

			return (
				<div className={`batter ${expandedClass}`} key={batterIndex} onClick={onClickBatter}>
					<div className={`result`}>
						<span className={`current-score`}>({batter.away_team_runs} - {batter.home_team_runs})</span> {batter.des}
					</div>
					<div className={`pitches`}>
						{strikezone}
						<div className={`pitch-list`}>
							{pitches}
						</div>
					</div>
				</div>	
			);
		}

		private renderHalfInning(halfInning: IInningHalf, halfInningType: HalfInningType, inningIndex: number)
		{
			const batters = halfInning.atbat.map((batter, i) =>
			{
				return this.renderBatter(batter, i);
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