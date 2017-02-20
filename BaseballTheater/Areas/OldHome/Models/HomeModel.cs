
using MlbDataServer.DataFetch;
using MlbDataServer.DataStructures;
using System;
using System.Web;
using BaseballTheater.Shared.Models;

namespace BaseballTheater.Areas.OldHome.Models
{
	public class HomeModel : BaseModel
	{
        public bool isOpeningDay { get; set; }
		public DateTime Date { get; set; }
		public GameSummaryCollection GameCollection { get; set; }

		public HomeModel(DateTime date, HttpRequestBase request) : base(request)
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