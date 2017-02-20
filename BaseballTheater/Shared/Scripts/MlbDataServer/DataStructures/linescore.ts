namespace Theater
{
	export class Linescore
	{
		public innings: Inning[];
		public runs: Runs;
		public hits: Hits;
		public errors: Errors;
	}

	export class HomeAway
	{
		public home: string;
		public away: string;
	}

	export class Inning extends HomeAway
	{

	}

	export class Runs extends HomeAway
	{

	}

	export class Hits extends HomeAway
	{

	}

	export class Errors extends HomeAway
	{

	}

	export class GameStatus
	{
		public status: string;
	}

	export enum League
	{
		AA,
		NN
	}
}