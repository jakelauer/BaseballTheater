using System.Web.Optimization;

namespace BaseballTheater.Areas.Game
{
	public static class BundleConfig
	{
		public static void RegisterBundles(BundleCollection bundles)
		{
			bundles.Add(new StyleBundle("~/stylebundles/game")
				.IncludeDirectory("~/Areas/Game/Styles/", "*.css"));

			bundles.Add(new ScriptBundle("~/scriptbundles/game")
				.IncludeDirectory("~/Areas/Game/Scripts/", "*.js"));
		}
	}
}