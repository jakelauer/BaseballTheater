// ReSharper disable InconsistentNaming
namespace Theater
{
	export interface IGameSummary
	{
		id: string;
		game_pk: number;
		time_date: string;
		game_type: string;
		time: string;
		ampm: string;
		time_zone: string;
		status: IGameStatus;
		league: string;
		inning: string;
		away_name_abbrev: string;
		away_team_name: string;
		away_file_code: string;
		home_name_abbrev: string;
		home_team_name: string;
		home_file_code: string;
		game_data_directory: string;
		linescore: ILinescore;
	}

	export class GameSummary implements IGameSummary
	{
		public id: string;
		public game_pk: number;
		public time_date: string;
		public game_type: string;
		public time: string;
		public ampm: string;
		public time_zone: string;
		public status: IGameStatus;
		public league: string;
		public inning: string;
		public away_name_abbrev: string;
		public away_team_name: string;
		public away_file_code: string;
		public home_name_abbrev: string;
		public home_team_name: string;
		public home_file_code: string;
		public game_data_directory: string;
		private _linescore: ILinescore;
		public linescore: Linescore;
		public dateObj: moment.Moment;

		constructor(data: IGameSummary)
		{
			this.id = data.id;
			this.game_pk = data.game_pk;
			this.time_date = data.time_date;
			this.game_type = data.game_type;
			this.time = data.time;
			this.ampm = data.ampm;
			this.time_zone = data.time_zone;
			this.dateObj = moment(data.time_date, "YYYY/MM/DD hh:mm");
			this.status = data.status;
			this.league = data.league;
			this.inning = data.inning;
			this.away_name_abbrev = data.away_name_abbrev;
			this.away_team_name = data.away_team_name;
			this.away_file_code = data.away_file_code;
			this.home_name_abbrev = data.home_name_abbrev;
			this.home_team_name = data.home_team_name;
			this.home_file_code = data.home_file_code;
			this.game_data_directory = data.game_data_directory;

			if (data.linescore !== undefined && data.linescore != null)
			{
				this.linescore = new Linescore(data.linescore);
			}
		}
	}
}