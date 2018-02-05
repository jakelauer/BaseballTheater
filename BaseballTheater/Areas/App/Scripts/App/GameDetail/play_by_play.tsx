namespace Theater.GameDetail
{
	type HalfInningType = "top" | "bottom";

	interface IPlayByPlayProps
	{
		inningsData: IInningsContainer;
		allPlayers: Map<string, IBatter | IPitcher>;
		highlights: IHighlightsCollection;
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

		private getSvIdsForPlay(play: IAtBat)
		{
			if (play.pitch)
			{
				return play.pitch.map(a => a.sv_id);
			}

			return [];
		}

		private getHighlightForPlay(play: IAtBat): IHighlight
		{
			const guid = play.play_guid;
			const svIds = this.getSvIdsForPlay(play);
			const hc = this.props.highlights;
			let foundHighlight: IHighlight = null;
			if (hc && hc.highlights && hc.highlights.media)
			{
				const highlights = hc.highlights.media;
				const matching = highlights.find(highlight =>
				{
					let found = false;
					if (highlight.keywords && highlight.keywords.keyword)
					{
						const keywords = highlight.keywords.keyword instanceof Array
							                 ? highlight.keywords.keyword
							                 : ([highlight.keywords.keyword] as any) as Keyword[];

						keywords.forEach(keyword =>
						{
							found = found || (keyword.type === "sv_id" && (keyword.value === guid || svIds.indexOf(keyword.value) > -1));
						});
					}
					return found;
				});

				if (matching)
				{
					foundHighlight = matching;
				}
			}

			return foundHighlight;
		}

		private renderBatter(batter: IAtBat, batterIndex: number, oldPitcher: IPitcher, newPitcher: IPitcher)
		{
			let pitches: JSX.Element[] = [];
			let strikezone = <div/>;
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
			const relatedHighlight = this.getHighlightForPlay(batter);
			const highlightHref = relatedHighlight ? HighlightUtility.getDefaultUrl(relatedHighlight) : "";
			const hasHighlight = highlightHref.trim() !== "" ? "has-highlight" : "";
			const pitcherChanged = (!oldPitcher) || (oldPitcher.id !== newPitcher.id);

			let pitcherChangedRendered = <div/>;
			if (pitcherChanged)
			{
				const changedString = oldPitcher !== null
					                      ? `${newPitcher.name_display_first_last} relieved ${oldPitcher.name_display_first_last}`
					                      : `${newPitcher.name_display_first_last} pitching`;
				pitcherChangedRendered = <div className={`pitcher-changed`} key={batterIndex * 99}>
					                         {changedString}
				                         </div>;
			}

			return (
				<div className={`play-by-play-event`} key={batterIndex}>
					{pitcherChangedRendered}
					<div className={`batter ${expandedClass}`}>
						<div className={`result`}>
							<a className={`play-highlight ${hasHighlight}`} target={`_blank`} href={highlightHref}>
								<i className={`material-icons`}>play_circle_filled</i>
							</a>
							<div className={`result-trigger`} onClick={onClickBatter}>
								<span className={`play-description`}>{batter.des}</span>
								<span className={`current-score`}>({batter.away_team_runs} - {batter.home_team_runs})</span>
							</div>
						</div>
						<div className={`pitches`}>
							{strikezone}
							<div className={`pitch-list`}>
								{pitches}
							</div>
						</div>
					</div>
				</div>
			);
		}

		private renderHalfInning(halfInning: IInningHalf, halfInningType: HalfInningType, inningIndex: number)
		{
			const players = this.props.allPlayers;
			if (halfInning && halfInning.atbat)
			{
				let oldPitcherData: IPitcher = null;
				const batters = halfInning.atbat.map((batter, i) =>
				{
					const newPitcherData = players.get(batter.pitcher) as IPitcher;
					const rendered = this.renderBatter(batter, i, oldPitcherData, newPitcherData);
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