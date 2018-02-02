namespace Theater
{

	export interface ISummaryLinescore
	{
		inning_line_score: IInning[];
		r: IRuns;
		h: IHits;
		e: IErrors;
	}

	export interface IDetailLinescore
	{
		inning_line_score: IInning[];
		away_team_runs: string;
		home_team_runs: string;
		away_team_hits: string;
		home_team_hits: string;
		away_team_errors: string;
		home_team_errors: string;
	}

	interface IRunsHitErrors
	{
		r: string;
		h: string;
		e: string;
	}

	export class Linescore implements ISummaryLinescore
	{
		public inning_line_score: IInning[];
		public r: IRuns;
		public h: IHits;
		public e: IErrors;

		public away: IRunsHitErrors;
		public home: IRunsHitErrors;

		public startingInning = 0;

		public setSummaryLinescore(data: ISummaryLinescore)
		{
			if (data.inning_line_score instanceof Array)
			{
				this.inning_line_score = data.inning_line_score;
			}
			else
			{
				this.inning_line_score = [];
			}

			this.r = data.r;
			this.h = data.h;
			this.e = data.e;

			let inningCount = 9;
			if (this.inning_line_score.length > inningCount)
			{
				inningCount = this.inning_line_score.length;
				this.startingInning = inningCount - 9;
			}

			this.away = {
				r: this.r.away,
				h: this.h.away,
				e: this.e.away
			}

			this.home = {
				r: this.r.home,
				h: this.h.home,
				e: this.e.home
			}
		}

		public setDetailLinescore(data: IDetailLinescore)
		{
			if (data.inning_line_score instanceof Array)
			{
				this.inning_line_score = data.inning_line_score;
			}
			else
			{
				this.inning_line_score = [];
			}

			this.r = {
				home: data.home_team_runs,
				away: data.away_team_runs
			};

			this.h = {
				home: data.home_team_hits,
				away: data.away_team_hits
			};

			this.e = {
				home: data.home_team_errors,
				away: data.away_team_errors
			};

			let inningCount = 9;
			if (this.inning_line_score.length > inningCount)
			{
				inningCount = this.inning_line_score.length;
				this.startingInning = inningCount - 9;
			}

			this.away = {
				r: data.away_team_runs,
				h: data.away_team_hits,
				e: data.away_team_errors
			}

			this.home = {
				r: data.home_team_runs,
				h: data.home_team_hits,
				e: data.home_team_errors
			}
		}
	}

	export enum HomeAway
	{
		Home,
		Away
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
		ind: string;
		status: string;
		inning: string;
		top_inning: string;
		inning_state: string;
		reason: string;
	}

	export enum League
	{
		AA,
		NN
	}
}