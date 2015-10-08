
using MlbDataServer.DataFetch;
using MlbDataServer.DataStructures;
using System;

namespace BaseballTheater.Areas.Home.Models
{
	public class HomeModel
	{
		public DateTime Date { get; set; }

		public GameSummaryCollection GameCollection { get; set; }

		public HomeModel(DateTime date)
		{
			this.Date = date;
			var today = DateTime.UtcNow.AddHours(-8);

			var gameSummaryCreator = new GameSummaryCreator();
			GameCollection = gameSummaryCreator.GetSummaryCollection(this.Date);

			if (GameCollection != null && GameCollection.GameSummaries == null && this.Date.Day == today.Day)
			{
				this.Date = date.AddDays(-1);
				GameCollection = gameSummaryCreator.GetSummaryCollection(this.Date);
			}
		}
	}
}