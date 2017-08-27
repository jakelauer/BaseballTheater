using System;
using System.Collections.Generic;
using System.Linq;

namespace BaseballTheater.Areas.Data.Models.Patreon
{
	public class BackersList
	{
		public static BackersList Instance = new BackersList();

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

					existing.backers.Add(sponsor);
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
			},
			new PremiumSponsor
			{
				backerName = "Career Benchwarmers",
				logo = "/images/backers/career-benchwarmers.jpg",
				team = Teams.pit,
				url = "https://www.facebook.com/CareerBenchwarmers/"
			}
		};

		private readonly List<TeamSponsor> _teamSponsors = new List<TeamSponsor>
		{
			new TeamSponsor(Teams.chc, "StorePorter", isStarBacker: true),
			new TeamSponsor(Teams.pit, "Career Benchwarmers", isStarBacker: true),

			new TeamSponsor(Teams.nyy, "James Donovan", isStarBacker: true),
			new TeamSponsor(Teams.bos, "Alexander Koch", isStarBacker: true),
			new TeamSponsor(Teams.nyy, "Sam Normington", isStarBacker: true),
			new TeamSponsor(Teams.bal, "Eric Hall", isStarBacker: true),
			new TeamSponsor(Teams.det, "Joe Pas", isStarBacker: true),
			new TeamSponsor(Teams.nyy, "Jan Larson", isStarBacker: true),
			new TeamSponsor(Teams.bos, "Mike Kearsley", isStarBacker: true),
			new TeamSponsor(Teams.chc, "Brad Koons", isStarBacker: true),
			new TeamSponsor(Teams.phi, "Curtis Gale", isStarBacker: true),
			new TeamSponsor(Teams.stl, "Kuhan", isStarBacker: true),

			new TeamSponsor(Teams.stl, "Ben Bradley", isBeerBacker: true),
			new TeamSponsor(Teams.hou, "Brian Hoang", isBeerBacker: true),
			new TeamSponsor(Teams.none, "Michelle Callaghan", isBeerBacker: true),
			new TeamSponsor(Teams.tor, "Larry D", isBeerBacker: true),
			new TeamSponsor(Teams.none, "Brian Stoops", isBeerBacker: true),

			new TeamSponsor(Teams.chc, "indianbadger"),
			new TeamSponsor(Teams.nyy, "Edward You"),
			new TeamSponsor(Teams.ari, "Ryan b"),
			new TeamSponsor(Teams.none, "Jaymoon"),
			new TeamSponsor(Teams.la, "Mike Branom"),
			new TeamSponsor(Teams.tor,"Richard Eriksson"),
			new TeamSponsor(Teams.none, "Daniel Tovatt"),
			new TeamSponsor(Teams.none,"Leon Ho"),
			new TeamSponsor(Teams.none,"Connor Reynolds"),
			new TeamSponsor(Teams.none,"Jack House"),

		};

	}
}