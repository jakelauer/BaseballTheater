// ReSharper disable InconsistentNaming
namespace Theater
{
	export interface IBacker
	{
		backerName: string;
		isBeerBacker: boolean;
	}

	export type BeerBacker = string;

	export type TeamSponsors = ITeamSponsorTeam[]

	export type PremiumSponsors = IPremiumSponsor[];

	interface ITeamSponsorTeam
	{
		team: Teams;
		backers: string[];
	}

	interface IPremiumSponsor
	{
		backerName: string;
		team: Teams;
		url?: string;
	}

	export class BackersList
	{
		public static async getBackersList()
		{
			return new Promise((resolve, reject) =>
			{
				$.ajax({
					url: "/Data/Patreon",
					dataType: "json",
					success: (response) => resolve(response)
				});
			});
		}

		public static Backers: IBacker[] = [
			{
				backerName: "Brian Stoops",
				isBeerBacker: true
			}
			//{
			//	backerName: "Vadakpat C Tirumalai",
			//	isBeerBacker: false
			//}
		];

		public static get TeamSponsors(): TeamSponsors
		{
			var teams = [
				{
					team: Teams.ari,
					backers: [
					]
				},
				{
					team: Teams.atl,
					backers: []
				},
				{
					team: Teams.bal,
					backers: []
				},
				{
					team: Teams.bos,
					backers: []
				},
				{
					team: Teams.chc,
					backers: []
				},
				{
					team: Teams.cin,
					backers: []
				},
				{
					team: Teams.chw,
					backers: []
				},
				{
					team: Teams.cle,
					backers: []
				},
				{
					team: Teams.col,
					backers: []
				},
				{
					team: Teams.det,
					backers: []
				},
				{
					team: Teams.hou,
					backers: []
				},
				{
					team: Teams.kc,
					backers: []
				},
				{
					team: Teams.ana,
					backers: []
				},
				{
					team: Teams.la,
					backers: []
				},
				{
					team: Teams.mia,
					backers: []
				},
				{
					team: Teams.mil,
					backers: []
				},
				{
					team: Teams.min,
					backers: []
				},
				{
					team: Teams.nym,
					backers: []
				},
				{
					team: Teams.nyy,
					backers: []
				},
				{
					team: Teams.oak,
					backers: []
				},
				{
					team: Teams.phi,
					backers: [
						"Curtis Gale"
					]
				},
				{
					team: Teams.pit,
					backers: []
				},
				{
					team: Teams.stl,
					backers: [
						"Kuhan"
					]
				},
				{
					team: Teams.sd,
					backers: []
				},
				{
					team: Teams.sf,
					backers: []
				},
				{
					team: Teams.sea,
					backers: []
				},
				{
					team: Teams.tb,
					backers: []
				},
				{
					team: Teams.tex,
					backers: []
				},
				{
					team: Teams.tor,
					backers: []
				},
				{
					team: Teams.was,
					backers: []
				}
			];

			teams = teams.sort((a, b) =>
			{
				return b.backers.length - a.backers.length || a.team - b.team;
			});

			return teams;
		}

		public static get PremiumSponsors(): PremiumSponsors
		{
			return [];
		}


		public static getTeamSponsorsCount(teamCode: string | number)
		{
			var sponsors = 0;

			for (var team of BackersList.TeamSponsors)
			{
				var matchThis = typeof teamCode === "string" ? Teams[teamCode] : teamCode;

				if (team.team === matchThis)
				{
					sponsors = team.backers.length;
					break;
				}
			}

			return sponsors;
		};

		public static getTeamSponsors(teamCode: string | number)
		{
			var sponsors = this.getTeamSponsorsCount(teamCode);

			var fanLingo = sponsors === 1 ? "fan" : "fans";
			return `${sponsors} ${fanLingo}`;
		}
	}

	export enum Teams
	{
		none,
		ari,
		atl,
		bal,
		bos,
		chc,
		cin,
		chw,
		cle,
		col,
		det,
		hou,
		kc,
		ana,
		la,
		mia,
		mil,
		min,
		nym,
		nyy,
		oak,
		phi,
		pit,
		stl,
		sd,
		sf,
		sea,
		tb,
		tex,
		tor,
		was
	}
}