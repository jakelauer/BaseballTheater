using System.Web.Mvc;

namespace BaseballTheater.Extensions
{
	public class CustomViewEngine : RazorViewEngine
	{
		public CustomViewEngine()
		{
			AreaViewLocationFormats = new[]
			{
				"~/Areas/{2}/Views/{0}.cshtml",
				"~/Areas/{2}/Views/Shared/{0}.cshtml",
				"~/Shared/Views/{0}.cshtml"
			};
			AreaMasterLocationFormats = new[]
			{
				"~/Areas/{2}/Views/{0}.cshtml",
				"~/Areas/{2}/Views/Shared/{0}.cshtml",
				"~/Shared/Views/{0}.cshtml"
			};
			AreaPartialViewLocationFormats = new[]
			{
				"~/Areas/{2}/Views/{0}.cshtml",
				"~/Areas/{2}/Views/Shared/{0}.cshtml",
				"~/Shared/Views/{0}.cshtml"
			};

			ViewLocationFormats = new[] 
			{
				"~/Areas/{1}/Views/{0}.cshtml",
				"~/Areas/{1}/Views/Shared/{0}.cshtml",
				"~/Views/{1}/{0}.cshtml", 
				"~/Views/Shared/{0}.cshtml",
				"~/Shared/Views/{0}.cshtml"
			};

			MasterLocationFormats = new[] 
			{
				"~/Views/{1}/{0}.cshtml",
				"~/Views/Shared/{0}.cshtml",
				"~/Shared/Views/{0}.cshtml"
			};

			PartialViewLocationFormats = new[] 
			{
				"~/Views/{1}/{0}.cshtml",
				"~/Views/Shared/{0}.cshtml",
				"~/Shared/Views/{0}.cshtml"
			};
		}
	}
}