using System.Web;
using System.Web.Optimization;

namespace BaseballTheater
{
	public class BundleConfig
	{
		// For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
		public static void RegisterBundles(BundleCollection bundles)
		{
			bundles.Add(new ScriptBundle("~/bundles/lib").Include(
						"~/Shared/Scripts/libraries/modernizr-*",
						"~/Shared/Scripts/libraries/jquery*"));
		}
	}
}
