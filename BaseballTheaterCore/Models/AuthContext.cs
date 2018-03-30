using System;
using System.Net;

namespace BaseballTheaterCore.Models
{
	public class AuthContext
	{
		public static string PatreonAuthCookieName = "patreon-auth";
		
		private Cookie authCookie { get; }

		public bool IsAuthenticated => this.authCookie != null && this.authCookie.Expires < DateTime.UtcNow;

		public AuthContext(Cookie authCookie)
		{
			this.authCookie = authCookie;
		}

	}
}