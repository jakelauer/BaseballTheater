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
	}

	public class TeamSponsorTeam
	{
		public Teams team { get; set; }
		public string[] backers { get; set; }
	}
}