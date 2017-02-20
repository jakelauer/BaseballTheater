using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BaseballTheater.Shared.Models;

namespace BaseballTheater.Areas.Home.Models
{
	public class HomeModel : BaseModel
	{
		public string DateString { get; }

		public HomeModel(HttpRequestBase request, string dateString) : base(request)
		{
			this.DateString = dateString;
		}
	}
}