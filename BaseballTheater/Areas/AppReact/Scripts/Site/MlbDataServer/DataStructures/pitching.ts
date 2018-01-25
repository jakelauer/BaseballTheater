namespace Theater
{
	export interface IBasePitchingStats
	{
		// Outs recorded
		out: number;
		h: number;
		r: number;
		er: number;
		bb: number;
		so: number;
		hr: number;
		// Batters Faced
		bf: number;
		era: number;
		pitcher: IPitcher[];
	}

	export interface IPitching extends IBasePitchingStats
	{
		// Home or Away
		team_flag: string;
		pitcher: IPitcher[];
		note: string;
		text_data: string;
	}

	export interface IPitcher extends IPlayer, IBasePitchingStats
	{
		// Pitch count
		np: number;
		// Strikes
		s: number;
		w: number;
		l: number;
		// If this pitcher got the win, 1. Otherwise, 0.
		win: boolean;
		sv: number;
		// Blown saves
		bs: number;
		hld: number;
		// IP (Season)
		s_ip: number;
		// Runs (Season)
		s_r: number;
		// Hits (Season)
		s_h: number;
		// Earned Runs (Season)
		s_er: number;
		// Walks (Season)
		s_bb: number;
		// Strikeouts (Season)
		s_so: number;
		game_score: number;
		era: number;
		// This pitcher got the save
		save: boolean;
		note: string;
	}
}