﻿using System.Collections.Generic;

namespace BaseballTheater.Areas.Data.Models.Patreon
{
	public class Backer
	{
		public string backerName { get; set; }
		public bool isBeerBacker { get; set; }
	}

	public class PremiumSponsor
	{
		public string backerName { get; set; }
		public Teams team { get; set; }
		public string url { get; set; }
		public string logo { get; set; }
	}

	public class TeamSponsorTeam
	{
		public Teams team { get; set; }
		public List<string> backers { get; set; }

		public TeamSponsorTeam(Teams team)
		{
			this.team = team;
			this.backers = new List<string>();
		}
	}

	public class TeamSponsor
	{
		public Teams team { get; set; }
		public string backerName { get; set; }

		public TeamSponsor(Teams team, string backerName)
		{
			this.team = team;
			this.backerName = backerName;
		}
	}
}