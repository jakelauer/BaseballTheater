namespace Theater
{
	type Next ="Y" | "N";

	export interface IInningsContainer
	{
		game: IInningsGame;
	}

	export interface IInningsGame
	{
		atBat: string;
		deck: string;
		hole: string;
		ind: string;
		inning: IInning[];
	}

	export interface IInning
	{
		num: string;
		away_team: string;
		home_team: string;
		next: Next;
		top: IInningHalf;
		bottom: IInningHalf;
	}

	export interface IInningHalf
	{
		atbat: IAtBat[];
	}

	export interface IPitch
	{
		ax: string;
		ay: string;
		az: string;
		break_angle: string;
		break_length: string;
		break_y: string;
		cc: string;
		code: string;
		des: string;
		des_es: string;
		end_speed: string;
		event_num: string;
		id: string;
		mt: string;
		pfx_x: string;
		pfx_z: string;
		pitch_type: string;
		pitch_type_detail: string;
		play_guid: string;
		px: string;
		pz: string;
		spin_dir: string;
		spin_rate: string;
		start_speed: string;
		sv_id: string;
		sz_bot: string;
		sz_top: string;
		tfs: string;
		tfs_zulu: string;
		type: string;
		type_confidence: string;
		vx0: string;
		vy0: string;
		vz0: string;
		x: string;
		x0: string;
		y: string;
		y0: string;
		z0: string;
		zone: string;
	}

	export interface IAtBat
	{
		num: number;
		b: number;
		s: string;
		o: string;
		start_tfs: string;
		start_tfs_zulu: string;
		end_tfs_zulu: string;
		batter: string;
		batterData: IBatter;
		stand: string;
		b_height: string;
		pitcher: string;
		p_throws: string;
		pitch: IPitch[];
		des: string;
		event_num: string;
		event: string;
		play_guid: string;
		home_team_runs: string;
		away_team_runs: string;
	}

	export class Innings implements IInningsContainer
	{
		public game: IInningsGame;
		private readonly allPlayersInGame: Map<string, IBatter | IPitcher>;

		constructor(data: IInningsContainer, private readonly boxScore: BoxScoreData)
		{
			if (data && boxScore)
			{
				this.game = data.game;

				this.allPlayersInGame = boxScore.allPlayers;

				this.process();
			}
		}

		private process()
		{
			this.game.inning = Utility.forceArray(this.game.inning);
			if (this.game && this.game.inning && this.game.inning.length > 0)
			{
				const innings = this.game.inning;

				for (let inning of innings)
				{
					if (inning.top)
					{
						this.processHalfInning(inning.top);
					}

					if (inning.bottom)
					{
						this.processHalfInning(inning.bottom);
					}
				}
			}
		}

		private processHalfInning(halfInning: IInningHalf)
		{
			halfInning.atbat = Utility.forceArray(halfInning.atbat);
			
			if (halfInning.atbat && halfInning.atbat.length > 0)
			{
				for (let atBat of halfInning.atbat)
				{
					const player = this.allPlayersInGame.get(atBat.batter) as IBatter;
					if (player)
					{
						atBat.batterData = player;
					}

					if (atBat.pitch)
					{
						atBat.pitch = Utility.forceArray(atBat.pitch);

						atBat.pitch.forEach(pitch =>
						{
							if (pitch)
							{
								pitch.pitch_type_detail = this.getPitchTypeDetail(pitch);
							}
						});
					}
				}
			}
		}

		private getPitchTypeDetail(pitch: IPitch)
		{
			let detail = "Unknown pitch";
			if (pitch && pitch.pitch_type)
			{
				switch (pitch.pitch_type)
				{
					case "CH":
						detail = "Changeup";
						break;
					case "CU":
						detail = "Curve";
						break;
					case "EP":
						detail = "Eephus";
						break;
					case "FC":
						detail = "Cutter";
						break;
					case "FF":
						detail = "Four-seam Fastball";
						break;
					case "FO":
					case "PO":
						detail = "Pitch Out";
						break;
					case "FS":
					case "SI":
						detail = "Sinker";
						break;
					case "FT":
						detail = "Two-seam Fastball";
						break;
					case "KC":
						detail = "Knuckle Curve";
						break;
					case "KN":
						detail = "Knuckleball";
						break;
					case "SF":
						detail = "Split-finger Fastball";
						break;
					case "SL":
						detail = "Slider";
						break;

					default:
						break;
				}
			}

			return detail;
		}
	}
}