// ReSharper disable InconsistentNaming
namespace Theater {
	interface HighlightContainer {
		media: IHighlight[];
	}

	export interface IGameSummary {
		id: string;
		game_pk: string;
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
		away_team_city: string;
		away_file_code: string;
		home_name_abbrev: string;
		home_team_city: string;
		home_team_name: string;
		home_file_code: string;
		game_data_directory: string;
		linescore: ILinescore;
		home_win: string;
		home_loss: string;
		away_win: string;
		away_loss: string;
		home_record: string;
		away_record: string;
		home_probable_pitcher: IProbablePitcher;
		away_probable_pitcher: IProbablePitcher;
		highlights: HighlightContainer;
	}

	export class GameSummary implements IGameSummary {
		public id: string;
		public game_pk: string;
		public time_date: string;
		public game_type: string;
		public time: string;
		public ampm: string;
		public time_zone: string;
		public status: IGameStatus;
		public league: string;
		public inning: string;
		public away_name_abbrev: string;
		public away_team_city: string;
		public away_team_name: string;
		public away_file_code: string;
		public home_name_abbrev: string;
		public home_team_name: string;
		public home_team_city: string;
		public home_file_code: string;
		public home_win: string;
		public home_loss: string;
		public away_win: string;
		public away_loss: string;
		public game_data_directory: string;
		private _linescore: ILinescore;
		public linescore: Linescore;
		public dateObj: moment.Moment;
		public dateObjLocal: moment.Moment;
		public home_probable_pitcher: IProbablePitcher;
		public away_probable_pitcher: IProbablePitcher;
		public topPlayHighlights: IHighlight[];
		public highlights: HighlightContainer;

		public get home_record() {
			return `${this.home_win}-${this.home_loss}`;
		}

		public get away_record() {
			return `${this.away_win}-${this.away_loss}`;
		}

		constructor(data: IGameSummary) {
			const gameTimezoneOffset = GameSummary.dst(new Date()) ? "-04:00" : "-05:00";

			const d = new Date();
			const userTimezoneOffset = d.getTimezoneOffset();
			const hoursToAdd = userTimezoneOffset > 0 ? 12 : -12;
			const localParsedDate = moment(data.time_date, "YYYY/MM/DD hh:mm").add(hoursToAdd, "hours").format();
			const timeRegex = /([0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2})([\-+][0-9]{2}:[0-9]{2})/g;
			const noZone = timeRegex.exec(localParsedDate)[1];
			const withZone = noZone + gameTimezoneOffset;

			this.id = data.id;
			this.game_pk = data.game_pk;
			this.time_date = data.time_date;
			this.game_type = data.game_type;
			this.time = data.time;
			this.ampm = data.ampm;
			this.time_zone = data.time_zone;
			this.dateObj = moment.parseZone(withZone);
			this.dateObjLocal = moment(noZone);
			this.status = data.status;
			this.league = data.league;
			this.inning = data.inning;
			this.away_name_abbrev = data.away_name_abbrev;
			this.away_team_name = data.away_team_name;
			this.away_team_city = GameSummary.getCityName(data.away_team_city);
			this.away_file_code = data.away_file_code;
			this.home_name_abbrev = data.home_name_abbrev;
			this.home_team_name = data.home_team_name;
			this.home_team_city = GameSummary.getCityName(data.home_team_city);
			this.home_file_code = data.home_file_code;
			this.game_data_directory = data.game_data_directory;
			this.home_win = data.home_win;
			this.home_loss = data.home_loss;
			this.away_win = data.away_win;
			this.away_loss = data.away_loss;
			this.home_probable_pitcher = data.home_probable_pitcher;
			this.away_probable_pitcher = data.away_probable_pitcher;
			if (data.highlights) {
				this.topPlayHighlights = data.highlights.media;
			}
			if (data.linescore !== undefined && data.linescore != null) {
				this.linescore = new Linescore(data.linescore);
			}
		}

		private static stdTimezoneOffset(date: Date) {
			const jan = new Date(date.getFullYear(), 0, 1);
			const jul = new Date(date.getFullYear(), 6, 1);
			return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
		}

		private static dst(date: Date) {
			return date.getTimezoneOffset() < this.stdTimezoneOffset(date);
		}

		private static getCityName(cityName: string) {
			if (cityName.toLowerCase().indexOf("la ") === 0) {
				return "Los Angeles";
			}

			if (cityName.toLowerCase().indexOf("chi") === 0) {
				return "Chicago";
			}

			if (cityName.toLowerCase().indexOf("ny") === 0) {
				return "New York";
			}

			return cityName;
		}
	}
}