using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BaseballTheater.Areas.Auth.Models
{
	public class AuthContext
	{
		public static string PatreonAuthCookieName = "patreon-auth";
		
		private HttpCookie authCookie { get; }

		public bool IsAuthenticated => this.authCookie != null && this.authCookie.Expires < DateTime.UtcNow;

		public AuthContext(HttpCookie authCookie)
		{
			this.authCookie = authCookie;
		}

	}
}