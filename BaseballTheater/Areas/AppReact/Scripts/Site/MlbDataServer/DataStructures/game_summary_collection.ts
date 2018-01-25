namespace Theater
{
	export interface IGameSummaryCollection
	{
		time_date: string;
		games: IGameDay;
	}

	export class GameSummaryCollection implements IGameSummaryCollection
	{
		public time_date: string;
		public games: GameDay;

		constructor(data: IGameSummaryCollection)
		{
			this.time_date = data.time_date;
			if (data.games)
			{
				//const gamesArray = data.games.game instanceof Array
				//	? data.games.game
				//	: [(data.games.game as any)] as IGameSummary[];

				//data.games.game = gamesArray;

				this.games = new GameDay(data.games);
			}
		}
	}

	export interface IGameDay
	{
		game?: IGameSummary[];
	}

	export class GameDay implements IGameDay
	{
		public game: GameSummary[] = [];

		constructor(data: IGameDay)
		{
			if (data.game && data.game.length)
			{
				data.game.forEach((game) =>
				{
					var gameSummary = new GameSummary(game);
					this.game.push(gameSummary);
				});
			}
			else if (data.game !== undefined)
			{
				// have to do this nefarious stuff because the xml2js library can output an object if there is just one game
				const gameSummary = new GameSummary((data.game as any) as IGameSummary);
				this.game.push(gameSummary);
			}
			else if (data.game === undefined)
			{
				console.debug("No games found for date");
			}
		}
	}
}