export interface ITeams
{
	ari: string;
	atl: string;
	bal: string;
	bos: string;
	chc: string;
	cws: string;
	chw: string;
	cin: string;
	cle: string;
	col: string;
	det: string;
	mia: string;
	hou: string;
	kc: string;
	laa: string;
	la: string;
	mil: string;
	min: string;
	nym: string;
	nyy: string;
	oak: string;
	phi: string;
	pit: string;
	sd: string;
	sf: string;
	sea: string;
	stl: string;
	tb: string;
	tex: string;
	tor: string;
	was: string;
}

export class Teams
{
	public static TeamList: ITeams = {
		ari: "Arizona Diamondbacks",
		atl: "Atlanta Braves",
		bal: "Baltimore Orioles",
		bos: "Boston Red Sox",
		chc: "Chicago Cubs",
		cws: "Chicago White Sox",
		chw: "Chicago White Sox",
		cin: "Cincinnati Reds",
		cle: "Cleveland Indians",
		col: "Colorado Rockies",
		det: "Detroit Tigers",
		mia: "Miami Marlins",
		hou: "Houston Astros",
		kc: "Kansas City Royals",
		laa: "Los Angeles Angels",
		la: "Los Angeles Dodgers",
		mil: "Milwaukee Brewers",
		min: "Minnesota Twins",
		nym: "New York Mets",
		nyy: "New York Yankees",
		oak: "Oakland Athletics",
		phi: "Philadelphia Phillies",
		pit: "Pittsburgh Pirates",
		sd: "San Diego Padres",
		sf: "San Francisco Giants",
		sea: "Seattle Mariners",
		stl: "St. Louis Cardinals",
		tb: "Tampa Bay Rays",
		tex: "Texas Rangers",
		tor: "Toronto Blue Jays",
		was: "Washington Nationals"
	};

	public static TeamIdList = {
		108: "laa",
		109: "ari",
		110: "bal",
		111: "bos",
		112: "chc",
		113: "cin",
		114: "cle",
		115: "col",
		116: "det",
		117: "hou",
		118: "kc",
		119: "la",
		120: "was",
		121: "nym",
		133: "oak",
		134: "pit",
		135: "sd",
		136: "sea",
		137: "sf",
		138: "stl",
		139: "tb",
		140: "tex",
		141: "tor",
		142: "min",
		143: "phi",
		144: "atl",
		145: "chw",
		146: "mia",
		147: "nyy",
		158: "mil",

		"laa": 108,
		"ari": 109,
		"bal": 110,
		"bos": 111,
		"chc": 112,
		"cin": 113,
		"cle": 114,
		"col": 115,
		"det": 116,
		"hou": 117,
		"kc": 118,
		"la": 119,
		"was": 120,
		"nym": 121,
		"oak": 133,
		"pit": 134,
		"sd": 135,
		"sea": 136,
		"sf": 137,
		"stl": 138,
		"tb": 139,
		"tex": 140,
		"tor": 141,
		"min": 142,
		"phi": 143,
		"atl": 144,
		"chw": 145,
		"cws": 145,
		"mia": 146,
		"nyy": 147,
		"mil": 158,
	}
}
