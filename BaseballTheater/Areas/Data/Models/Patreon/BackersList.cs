using System;
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
				var teamSponsorsTeams = new List<TeamSponsorTeam>();

				foreach (var sponsor in _teamSponsors)
				{
					var existing = teamSponsorsTeams.FirstOrDefault(a => a.team == sponsor.team);
					if (existing == null)
					{
						existing = new TeamSponsorTeam(sponsor.team);

						teamSponsorsTeams.Add(existing);
					}

					existing.backers.Add(sponsor.backerName);
				}

				foreach (Teams team in Enum.GetValues(typeof(Teams)))
				{
					if (teamSponsorsTeams.All(a => a.team != team))
					{
						teamSponsorsTeams.Add(new TeamSponsorTeam(team));
					}
				}

				var sorted = teamSponsorsTeams
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

		private readonly List<TeamSponsor> _teamSponsors = new List<TeamSponsor>
		{
			new TeamSponsor(Teams.chc, "StorePorter"),
			new TeamSponsor(Teams.chc, "Brad Koons"),
			new TeamSponsor(Teams.phi, "Curtis Gale"),
			new TeamSponsor(Teams.stl, "Kuhan")
		};

	}
}