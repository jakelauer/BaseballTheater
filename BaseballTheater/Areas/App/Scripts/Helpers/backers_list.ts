// ReSharper disable InconsistentNaming
namespace Theater
{
	export type Backer = string;

	export type BeerBacker = string;

	export type TeamSponsors = ITeamSponsorTeam[]

	export type PremiumSponsors = IPremiumSponsor[];

	interface ITeamSponsorTeam
	{
		team: Teams;
		backers: Backer[];
	}

	interface IPremiumSponsor
	{
		backerName: string;
		team: Teams;
		url?: string;
	}

	export class BackersList
	{
		public static Backers: Backer[] = [
		];

		public static BeerBackers: BeerBacker[] = [
			"Brian Stoops"
		];

		public static get TeamSponsors(): TeamSponsors
		{
			const teams = [
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
					backers: []
				},
				{
					team: Teams.pit,
					backers: []
				},
				{
					team: Teams.stl,
					backers: []
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

			teams.sort((a, b) =>
			{
				var fanCount = a.backers.length > b.backers.length ? -1 : 0;
				var alphabetical = Teams[a.team] < Teams[b.team] ? -1 : 0;
				return fanCount || alphabetical;
			});

			return teams;
		}

		public static get PremiumSponsors(): PremiumSponsors
		{
			return [];
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