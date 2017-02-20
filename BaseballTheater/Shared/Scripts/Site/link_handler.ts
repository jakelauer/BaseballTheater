namespace Theater.Site
{
	export class LinkHandler
	{
		public static Instance = new LinkHandler();
		private initialized = false;

		public initialize()
		{
			if (this.initialized)
			{
				return;
			}

			this.addListeners();

			this.initialized = true;
		}

		public addListeners()
		{
			$(document).on("click", "a[href]:not([href^='http'])", (e) =>
			{
				var $el = $(e.currentTarget);
				var href = $el.attr("href");
				if (Site.currentPage.matchingUrl.test(href))
				{
					e.preventDefault();
					history.pushState(null, null, href);
					$(window).trigger("statechange");
				}
			});

			$(window).on("popstate statechange", (e) =>
			{
				Site.currentPage.page.renew(location.pathname);
			});
		}
	}
}