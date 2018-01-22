namespace Theater
{
	class GameListReact extends React.Component
	{
		private games: GameSummary[];

		public initialize()
		{
		}

		public render(): React.ReactNode
		{
			return (
				<div className={`game-list`}>
					{
						this.games.map(gameSummary =>
						{
							<GameSummaryReact game={gameSummary}/>
						})
					}
				</div>
			);
		}
	}

	ReactDOM.render(
		<GameListReact/>,
		document.getElementById('body-wrapper')
	);
}