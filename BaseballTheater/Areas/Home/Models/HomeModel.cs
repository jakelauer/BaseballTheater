
using MlbDataServer;
using MlbDataServer.DataStructures;
using System;
using System.Threading.Tasks;

namespace BaseballTheater.Areas.Home.Models
{
	public class HomeModel
	{
		public DateTime Date { get; set; }

		public GameSummaryCollection GameCollection { get; set; }

		public HomeModel(DateTime date)
		{
			this.Date = date;

			var gameSummaryCreator = new GameSummaryCreator();
			GameCollection = gameSummaryCreator.GetSummaryCollection(this.Date);
		}
	}
}