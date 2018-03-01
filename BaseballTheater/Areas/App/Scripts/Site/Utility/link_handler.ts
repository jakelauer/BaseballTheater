namespace Theater.Utility
{
	export class LinkHandler
	{
		public static Instance = new LinkHandler();
		private initialized = false;
		public stateChangeDistributor: Distributor<Location>;

		public initialize()
		{
			if (this.initialized)
			{
				return;
			}

			this.stateChangeDistributor = new Distributor<Location>();

			this.addListeners();

			this.initialized = true;
		}

		private addListeners()
		{
			$(document).on("click", "a[href]:not([href^='http'])", (e) =>
			{
				if (e.metaKey || e.shiftKey || e.ctrlKey)
				{
					return true;
				}

				e.preventDefault();

				var $el = $(e.currentTarget);
				var href = $el.attr("href");
				LinkHandler.pushState(href);
			});

			$(window).on("popstate statechange", (e) =>
			{
				this.stateChangeDistributor.distribute(location);
			});
		}

		public static pushState(href: string)
		{
			history.pushState(null, null, href);
			$(window).trigger("statechange");
		}

		private ajax(href: string)
		{
			return new Promise((resolve, reject) =>
			{
				$.ajax({
					url: href,
					type: "GET",
					success: (response: string) => resolve(response),
					error: error => reject(error)
				});
			});
		}

		public static parseHash()
		{
			const kvpArray = location.hash.substr(1).split("&");
			return this.parseKvps(kvpArray);
		}

		public static parseQuery()
		{
			const kvpArray = location.search.substr(1).split("&");
			return this.parseKvps(kvpArray);
		}

		private static parseKvps(kvpArray: string[])
		{
			const dict: { [key: string]: string } = {};

			kvpArray.forEach((kvpString) =>
			{
				const kvp = kvpString.split("=");
				dict[kvp[0]] = kvp[1];
			});

			return dict;
		}
	}
}