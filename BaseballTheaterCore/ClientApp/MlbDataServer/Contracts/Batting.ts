import {IPlayer} from "./player";

export interface IBatting
{
	team_flag: string;
	note: string;
	text_data: string;
	batter: IBatter[];
}

export interface IBaseBattingStats
{
	ab: number;
	// Runs
	r: number;
	// Hits
	h: number;
	// Doubles
	d: number;
	// Triples
	t: number;
	// Home Runs
	hr: number;
	rbi: number;
	bb: number;
	// Putouts
	po: number;
	// ???
	da: number;
	// Strikeouts
	so: number;
	// Left On Base
	lob: number;
	avg: number;
	obp: number;
	slg: number;
	ops: number;
}

export interface IBatter extends IPlayer, IBaseBattingStats
{
	// Batting order
	bo: number;
	// Assists?
	a: number;
	// Sac Bunts
	sac: number;
	// Sac Flies
	sf: number;
	// Errors
	e: number;
	hbp: number;
	fldg: number;
	// ??
	ao: number;
	// ??
	go: number;
	gidp: number;
	sb: number;
	cs: number;
	// Home Runs (Season)
	s_hr: number;
	// RBIs (Season)
	s_rbi: number;
	// Hits (Season)
	s_h: number;
	// Walks (Season)
	s_bb: number;
	// Runs (Season)
	s_r: number;
	// Strikeouts (Season)
	s_so: number;
	note: string;
}
