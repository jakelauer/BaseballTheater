namespace BaseballTheater.Areas.Data.Models.Patreon
{
	public class PatreonModel
	{
		public static PatreonModel Instance = new PatreonModel();

		public BackersList Backers = BackersList.Instance;
		public double GoalPercentage = (double)  60 / 100;
	}
}