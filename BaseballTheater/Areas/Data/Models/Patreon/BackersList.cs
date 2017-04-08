using System.Collections.Generic;
using System.Linq;

namespace BaseballTheater.Areas.Data.Models.Patreon
{
	public class BackersList
	{
		public static BackersList Instance = new BackersList();
		
		public List<Backer> Backers = new List<Backer>
		{
			new Backer
			{
				backerName = "Brian Stoops",
				isBeerBacker = true
			}
		};

		public List<TeamSponsorTeam> TeamSponsors
		{
			get
			{
				var sorted = _teamSponsors
					.OrderByDescending(a => a.backers.Count)
					.ThenByDescending(a => a.team);

				return sorted.ToList();
			}
		}

		public List<PremiumSponsor> PremiumSponsors = new List<PremiumSponsor>
		{
			new PremiumSponsor
			{
				backerName = "StorePorter",
				logo = "/images/backers/storeporter.png",
				team = Teams.chc,
				url = "http://storeporter.com"
			}
		};

		private readonly List<TeamSponsorTeam> _teamSponsors = new List<TeamSponsorTeam>
		{
			new TeamSponsorTeam
			{
				team = Teams.ari,
				backers = new List<string>()
			},
			new TeamSponsorTeam
			{
				team = Teams.atl,
				backers = new List<string>()
			},
			new TeamSponsorTeam
			{
				team = Teams.bal,
				backers = new List<string>()
			},
			new TeamSponsorTeam
			{
				team = Teams.bos,
				backers = new List<string>()
			},
			new TeamSponsorTeam
			{
				team = Teams.chc,
				backers = new List<string>()
				{
					"StorePorter"
				}
			},
			new TeamSponsorTeam
			{
				team = Teams.cin,
				backers = new List<string>()
			},
			new TeamSponsorTeam
			{
				team = Teams.chw,
				backers = new List<string>()
			},
			new TeamSponsorTeam
			{
				team = Teams.cle,
				backers = new List<string>()
			},
			new TeamSponsorTeam
			{
				team = Teams.col,
				backers = new List<string>()
			},
			new TeamSponsorTeam
			{
				team = Teams.det,
				backers = new List<string>()
			},
			new TeamSponsorTeam
			{
				team = Teams.hou,
				backers = new List<string>()
			},
			new TeamSponsorTeam
			{
				team = Teams.kc,
				backers = new List<string>()
			},
			new TeamSponsorTeam
			{
				team = Teams.ana,
				backers = new List<string>()
			},
			new TeamSponsorTeam
			{
				team = Teams.la,
				backers = new List<string>()
			},
			new TeamSponsorTeam
			{
				team = Teams.mia,
				backers = new List<string>()
			},
			new TeamSponsorTeam
			{
				team = Teams.mil,
				backers = new List<string>()
			},
			new TeamSponsorTeam
			{
				team = Teams.min,
				backers = new List<string>()
			},
			new TeamSponsorTeam
			{
				team = Teams.nym,
				backers = new List<string>()
			},
			new TeamSponsorTeam
			{
				team = Teams.nyy,
				backers = new List<string>()
			},
			new TeamSponsorTeam
			{
				team = Teams.oak,
				backers = new List<string>()
			},
			new TeamSponsorTeam
			{
				team = Teams.phi,
				backers = new List<string>
				{
					"Curtis Gale"
				}
			},
			new TeamSponsorTeam
			{
				team = Teams.pit,
				backers = new List<string>()
			},
			new TeamSponsorTeam
			{
				team = Teams.stl,
				backers = new List<string>
				{
					"Kuhan"
				}
			},
			new TeamSponsorTeam
			{
				team = Teams.sd,
				backers = new List<string>()
			},
			new TeamSponsorTeam
			{
				team = Teams.sf,
				backers = new List<string>()
			},
			new TeamSponsorTeam
			{
				team = Teams.sea,
				backers = new List<string>()
			},
			new TeamSponsorTeam
			{
				team = Teams.tb,
				backers = new List<string>()
			},
			new TeamSponsorTeam
			{
				team = Teams.tex,
				backers = new List<string>()
			},
			new TeamSponsorTeam
			{
				team = Teams.tor,
				backers = new List<string>()
			},
			new TeamSponsorTeam
			{
				team = Teams.was,
				backers = new List<string>()
			}
		};
	}
}