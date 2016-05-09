using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BaseballTheater.Shared.Models
{
	public class BaseModel
	{
		public string FavoriteTeam { get; set; }

		public BaseModel(HttpRequestBase request)
		{
			this.FavoriteTeam = GetFavoriteTeam(request);
		}

		private string GetFavoriteTeam(HttpRequestBase request)
		{
			var cookie = request.Cookies["favoriteteam"];
			return cookie != null ? cookie.Value : "";
		}
	}
}