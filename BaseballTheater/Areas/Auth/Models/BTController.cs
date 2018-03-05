using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Newtonsoft.Json;

namespace BaseballTheater.Areas.Auth.Models
{
	public class BTController : Controller
	{
		internal AuthContext AuthContext { get; set; }

		private readonly Dictionary<string, object> _pageData = new Dictionary<string, object>();

		public BTController() : base()
		{
			ViewBag.PageData = this._pageData;
		}

		protected override IAsyncResult BeginExecute(RequestContext requestContext, AsyncCallback callback, object state)
		{
			var authCookie = requestContext.HttpContext.Request.Cookies.Get(AuthContext.PatreonAuthCookieName);
			this.AuthContext = new AuthContext(authCookie);

			this.AddPageData("AuthContext", this.AuthContext);

			return base.BeginExecute(requestContext, callback, state);
		}

		public void AddPageData(string key, object data)
		{
			this._pageData[key] = data;

			ViewBag.PageData = _pageData;
		}
	}
}