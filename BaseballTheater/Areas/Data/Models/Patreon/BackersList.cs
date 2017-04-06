using System.Linq;

namespace BaseballTheater.Areas.Data.Models.Patreon
{
	public class BackersList
	{
		public static BackersList Instance = new BackersList();

		public PremiumSponsor[] PremiumSponsors =
		{

		};

		public Backer[] Backers =
		{
			new Backer
			{
				backerName = "Brian Stoops",
				isBeerBacker = true
			}
		};

		public TeamSponsorTeam[] TeamSponsors
		{
			get
			{
				var sorted = _teamSponsors
					.OrderByDescending(a => a.backers.Length)
					.ThenByDescending(a => a.team);

				return sorted.ToArray();
			}
		}

		private readonly TeamSponsorTeam[] _teamSponsors =
		{
			new TeamSponsorTeam
			{
				team = Teams.ari,
				backers = new string[]
				{

				}
			},
			new TeamSponsorTeam
			{
				team = Teams.atl,
				backers = new string[]
				{

				}
			},
			new TeamSponsorTeam
			{
				team = Teams.bal,
				backers = new string[] { }
			},
			new TeamSponsorTeam
			{
				team = Teams.bos,
				backers = new string[] { }
			},
			new TeamSponsorTeam
			{
				team = Teams.chc,
				backers = new string[] { }
			},
			new TeamSponsorTeam
			{
				team = Teams.cin,
				backers = new string[] { }
			},
			new TeamSponsorTeam
			{
				team = Teams.chw,
				backers = new string[] { }
			},
			new TeamSponsorTeam
			{
				team = Teams.cle,
				backers = new string[] { }
			},
			new TeamSponsorTeam
			{
				team = Teams.col,
				backers = new string[] { }
			},
			new TeamSponsorTeam
			{
				team = Teams.det,
				backers = new string[] { }
			},
			new TeamSponsorTeam
			{
				team = Teams.hou,
				backers = new string[] { }
			},
			new TeamSponsorTeam
			{
				team = Teams.kc,
				backers = new string[] { }
			},
			new TeamSponsorTeam
			{
				team = Teams.ana,
				backers = new string[] { }
			},
			new TeamSponsorTeam
			{
				team = Teams.la,
				backers = new string[] { }
			},
			new TeamSponsorTeam
			{
				team = Teams.mia,
				backers = new string[] { }
			},
			new TeamSponsorTeam
			{
				team = Teams.mil,
				backers = new string[] { }
			},
			new TeamSponsorTeam
			{
				team = Teams.min,
				backers = new string[] { }
			},
			new TeamSponsorTeam
			{
				team = Teams.nym,
				backers = new string[] { }
			},
			new TeamSponsorTeam
			{
				team = Teams.nyy,
				backers = new string[] { }
			},
			new TeamSponsorTeam
			{
				team = Teams.oak,
				backers = new string[] { }
			},
			new TeamSponsorTeam
			{
				team = Teams.phi,
				backers = new[]
				{
					"Curtis Gale"
				}
			},
			new TeamSponsorTeam
			{
				team = Teams.pit,
				backers = new string[] { }
			},
			new TeamSponsorTeam
			{
				team = Teams.stl,
				backers = new[]
				{
					"Kuhan"
				}
			},
			new TeamSponsorTeam
			{
				team = Teams.sd,
				backers = new string[] { }
			},
			new TeamSponsorTeam
			{
				team = Teams.sf,
				backers = new string[] { }
			},
			new TeamSponsorTeam
			{
				team = Teams.sea,
				backers = new string[] { }
			},
			new TeamSponsorTeam
			{
				team = Teams.tb,
				backers = new string[] { }
			},
			new TeamSponsorTeam
			{
				team = Teams.tex,
				backers = new string[] { }
			},
			new TeamSponsorTeam
			{
				team = Teams.tor,
				backers = new string[] { }
			},
			new TeamSponsorTeam
			{
				team = Teams.was,
				backers = new string[] { }
			}
		};
	}
}