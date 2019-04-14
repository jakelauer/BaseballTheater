/* ReSharper disable InconsistentNaming*/
import {IDetailLinescore, Linescore} from "./linescore";
import {IPitcher, IPitching} from "./pitching";
import {IBatter, IBatting} from "./batting";

export interface IBoxScoreContainer
{
	boxscore: IBoxScoreData;
}

export interface IBoxScoreData
{
	game_id: string;
	game_pk: string;
	venue_id: number;
	venue_name: string;
	away_team_code: string;
	home_team_code: string;
	away_id: number;
	home_id: number;
	away_fname: string;
	home_fname: string;
	away_sname: string;
	home_sname: string;
	date: string;
	away_wins: number;
	away_loss: number;
	home_wins: number;
	home_loss: number;
	status_ind: string;
	linescore: IDetailLinescore;
	pitching?: IPitching[];
	batting?: IBatting[];
	game_info: string;
}

export class BoxScoreData
{
	public batting_home: IBatting;
	public batting_away: IBatting;
	public pitching_home: IPitching;
	public pitching_away: IPitching;
	public game_info: string;
	public game_id: string;
	public game_pk: string;
	public venue_id: number;
	public venue_name: string;
	public away_team_code: string;
	public home_team_code: string;
	public away_id: number;
	public home_id: number;
	public away_fname: string;
	public home_fname: string;
	public away_sname: string;
	public home_sname: string;
	public date: string;
	public away_wins: number;
	public away_loss: number;
	public home_wins: number;
	public home_loss: number;
	public status_ind: string;
	public linescore: Linescore;

	public get allPlayers()
	{
		let allPlayersArray: (IBatter | IPitcher)[] = [];
		try
		{
			allPlayersArray = [
				...this.batting_home.batter,
				...this.batting_away.batter,
				...this.pitching_home.pitcher,
				...this.pitching_away.pitcher
			];
		}
		catch (e)
		{
		}

		const allPlayersById = new Map(allPlayersArray.map((player): [string, IBatter | IPitcher] => ([player.id, player]) as [string, IBatter | IPitcher]));

		return allPlayersById;
	}

	constructor(data: IBoxScoreContainer)
	{
		if (!data || !data.boxscore)
		{
			return;
		}

		this.game_info = data.boxscore.game_info;
		this.game_id = data.boxscore.game_id;
		this.game_pk = data.boxscore.game_pk;
		this.venue_id = data.boxscore.venue_id;
		this.venue_name = data.boxscore.venue_name;
		this.away_team_code = this.fixTeamCode(data.boxscore.away_team_code);
		this.home_team_code = this.fixTeamCode(data.boxscore.home_team_code);
		this.away_id = data.boxscore.away_id;
		this.home_id = data.boxscore.home_id;
		this.away_fname = data.boxscore.away_fname;
		this.home_fname = data.boxscore.home_fname;
		this.away_sname = data.boxscore.away_sname;
		this.home_sname = data.boxscore.home_sname;
		this.date = data.boxscore.date;
		this.away_wins = data.boxscore.away_wins;
		this.away_loss = data.boxscore.away_loss;
		this.home_wins = data.boxscore.home_wins;
		this.home_loss = data.boxscore.home_loss;
		this.status_ind = data.boxscore.status_ind;

		if (data.boxscore.batting)
		{
			for (var batting of data.boxscore.batting)
			{
				if (!(batting.batter instanceof Array))
				{
					batting.batter = [(batting.batter as any)];
				}

				batting.team_flag === "home"
					? this.batting_home = batting
					: this.batting_away = batting;
			}
		}

		if (data.boxscore.pitching)
		{
			for (var pitching of data.boxscore.pitching)
			{
				if (!(pitching.pitcher instanceof Array))
				{
					pitching.pitcher = [(pitching.pitcher as any)];
				}

				pitching.team_flag === "home"
					? this.pitching_home = pitching
					: this.pitching_away = pitching;
			}
		}


		if (data.boxscore.linescore !== undefined && data.boxscore.linescore != null)
		{
			this.linescore = new Linescore();
			this.linescore.setDetailLinescore(data.boxscore.linescore);
		}
	}

	private fixTeamCode(code: string)
	{
		let fixedCode = code;
		switch (code)
		{
			case "cha":
				fixedCode = "chw";
				break;
			case "chn":
				fixedCode = "chc";
				break;
			case "kca":
				fixedCode = "kc";
				break;
			case "nyn":
				fixedCode = "nym";
				break;
			case "nya":
				fixedCode = "nyy";
				break;
			case "sdn":
				fixedCode = "sd";
				break;
			case "sfn":
				fixedCode = "sf";
				break;
			case "sln":
				fixedCode = "stl";
				break;
			case "tba":
				fixedCode = "tb";
				break;
		}
		return fixedCode;
	}
}
