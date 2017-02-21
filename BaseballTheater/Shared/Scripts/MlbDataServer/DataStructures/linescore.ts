namespace Theater
{
	export interface ILinescore
	{
		inning: IInning[];
		r: IRuns;
		h: IHits;
		e: IErrors;
	}

	export class Linescore implements ILinescore
	{
		public inning: IInning[];
		public r: IRuns;
		public h: IHits;
		public e: IErrors;

		public startingInning = 0;

		constructor(data: ILinescore)
		{
			this.inning = data.inning;
			this.r = data.r;
			this.h = data.h;
			this.e = data.e;
			
			let inningCount = 9;
			if (this.inning.length > inningCount)
			{
				inningCount = this.inning.length;
				this.startingInning = inningCount - 9;
			}
		}
	}

	export interface IHomeAway
	{
		home: string;
		away: string;
	}

	export interface IInning extends IHomeAway
	{

	}

	export interface IRuns extends IHomeAway
	{

	}

	export interface IHits extends IHomeAway
	{

	}

	export interface IErrors extends IHomeAway
	{

	}

	export interface IGameStatus
	{
		status: string;
	}

	export enum League
	{
		AA,
		NN
	}
}