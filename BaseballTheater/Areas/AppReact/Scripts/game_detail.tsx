namespace Theater
{
	interface IGameDetailProps
	{
		gameSummary: GameSummary;
		boxScore: BoxScore;
		allHighlights: IHighlight[];
		specialHighlights: IHighlight[];
		detailMode: number;
	}

	interface GameDetailData
	{
		detailMode: number;
	}

	export class GameDetailReact extends React.Component<IGameDetailProps, any>
	{
		private data: GameDetailData;

		constructor(props: IGameDetailProps)
		{
			super(props);

			this.data = {
				detailMode: props.detailMode
			}
		}

		private switchDetailMode(e: React.MouseEvent<HTMLDivElement>, mode: number)
		{
			this.data.detailMode = mode;
		}

		private renderHighliights(specialHighlights: IHighlight[], allHighlights: IHighlight[])
		{
			return (
				<div className={`highlights-container`}>
					<h2>Highlights</h2>
					{ specialHighlights && specialHighlights.length > 0 &&
						<div className={`special-highlights`}>
							{
							    specialHighlights.map((highlight) => (
								    <HighlightReact highlight={highlight} />
							    ))
						    }
						</div>
					}

					<div className={`all-highlights`}>
						{
							allHighlights.map(highlight => (
								<HighlightReact highlight={highlight} />
							))
						}
					</div>
				</div>
			);
		}

		private showNoHighlights()
		{
			return true;
		}

		private getTeamSponsors(fileCode: string)
		{
			return 0;
		}

		public render()
		{
			const gameSummary = this.props.gameSummary;
			const boxScoreData = this.props.boxScore;
			const allHighlights = this.props.allHighlights;
			const specialHighlights = this.props.specialHighlights;

			const highlightsOnClass = this.data.detailMode === 0 ? "on" : "";
			const boxScoreOnClass = this.data.detailMode === 1 ? "on" : "";

			return (
				<div className={`game-detail-container`}>
					<div className={`highlight-game-summary`}>

						<div className={`team away`}>
							<a className={`team-info`} href="/backers">
								<div className={`team-city team-color ${gameSummary.away_file_code}`}>
									{gameSummary.away_team_city}
								</div>
								<div className={`team-name team-color ${gameSummary.away_file_code}`}>
									{gameSummary.away_team_name}
								</div>
							</a>
							<a className={`backers`} href="/backers">
								{this.getTeamSponsors(gameSummary.away_file_code)}
							</a>
						</div>

						<GameSummaryReact game={gameSummary}/>

						<div className={`team home`}>
							<a className={`team-info`} href="/backers">
								<div className={`team-city team-color ${gameSummary.home_file_code}`}>
									{gameSummary.home_team_city}
								</div>
								<div className={`team-name team-color ${gameSummary.home_file_code}`}>
									{gameSummary.home_team_name}
								</div>
							</a>
							<a className={`backers`} href="/backers">
								{this.getTeamSponsors(gameSummary.home_file_code)}
							</a>
						</div>

					</div>

					{boxScoreData && allHighlights &&
						<div data-vif="boxScore && allHighlights" className={`mode-switch-container`}>
							<div className={`mode-switch`}>
								<div className={`switch-item ${highlightsOnClass}`} onClick={e => this.switchDetailMode(e, 0)}>
									Highlights
								</div>
								<div className={`switch-item ${boxScoreOnClass}`} onClick={e => this.switchDetailMode(e, 1)}>
									Box Score
								</div>
							</div>
						</div>
					}

					<div className={`game-detail-wrapper`}>
						<div className={`highlights-wrapper ${highlightsOnClass}`}>
							{allHighlights && allHighlights.length > 0 &&
								this.renderHighliights(specialHighlights, allHighlights)
							}

							{this.showNoHighlights() &&
								<div className={`empty`}>
									No highlights found for this game. Highlights for some games may not be published until the game is complete.
								</div>
							}
						</div>

						<div className={`box-score-wrapper ${boxScoreOnClass}`}>
							{boxScoreData &&
								<BoxScoreReact boxScoreData={boxScoreData}/>
							}
						</div>
					</div>
				</div>
			);
		}
	}
}