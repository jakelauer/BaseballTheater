using System;
using System.Collections.Generic;
using BaseballTheaterCore.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace BaseballTheaterCore.Controllers
{
	public class BtController : Controller
	{
		private readonly Dictionary<string, object> _pageData = new Dictionary<string, object>();

		public BtController() : base()
		{
			ViewBag.PageData = this._pageData;
		}

		public override void OnActionExecuting(ActionExecutingContext context)
		{
			this.AddPageData("IsAuthenticated", User.Identity.IsAuthenticated);
			//this.AddPageData("RewardPledge", User.Identity);
			
			base.OnActionExecuting(context);
		}

		public void AddPageData(string key, object data)
		{
			this._pageData[key] = data;

			ViewBag.PageData = _pageData;
		}
	}
}