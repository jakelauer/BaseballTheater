using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace BaseballTheater.Areas.New
{
	public static class BundleConfig
	{
		public static void RegisterBundles(BundleCollection bundles)
		{
			bundles.Add(new StyleBundle("~/stylebundles/new")
				.IncludeDirectory("~/Areas/New/Styles/", "*.css"));

			bundles.Add(new ScriptBundle("~/scriptbundles/new")
				.IncludeDirectory("~/Areas/New/Scripts/", "*.js"));
		}
	}
}