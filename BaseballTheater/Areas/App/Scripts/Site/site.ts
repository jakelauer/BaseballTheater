namespace Theater.Site
{
	var pages: IPageParams[] = [];
	var initializedPages: IPageParams[] = [];
	export var initializeCurrentPage: () => void;
	var initializeSite: () => void;
	var siteLoadingTimeout = 0;
	export var isLoading = false;

	export var currentPage: IPageParams = null;

	initializeSite = () =>
	{
		Site.LinkHandler.Instance.initialize();
		initializeCurrentPage();

		Responsive.Instance.initialize();

		$(".mobile-menu-trigger").on("click", () =>
		{
			$("header .links").toggleClass("open");
		});
	}

	initializeCurrentPage = () =>
	{
		//showDisclaimer();

		$(window).scrollTop(0);

		$(".links a").removeClass("active");

		if (currentPage !== null)
		{
			currentPage.page.destroy();
		}

		for (let page of pages)
		{
			if (page.matchingUrl.test(location.pathname))
			{
				$(`.links a[data-name='${page.name}']`).addClass("active");

				currentPage = page;
				if (initializedPages.indexOf(page) > -1)
				{
					currentPage.page.renew(location.pathname);
				}
				else
				{
					initializedPages.push(page);

					currentPage.page.initialize();
					currentPage.page.dataBind();
				}
			}
		}
	};

	export var addPage = (params: IPageParams) =>
	{
		pages.push(params);
	};

	export var startLoading = () =>
	{
		clearTimeout(siteLoadingTimeout);
		siteLoadingTimeout = setTimeout(() =>
			{
				$("#body-wrapper").addClass("loading");
			},
			250);
		isLoading = true;
	};

	export var stopLoading = () =>
	{
		clearTimeout(siteLoadingTimeout);
		$("#body-wrapper").removeClass("loading");
		isLoading = false;
	};

	export var trackEvent = (category: string, action: string, label?: string, value?: any, metricObject?: any) =>
	{
		var data: any = {};

		if (label !== undefined)
		{
			data.eventLabel = label;
		}

		if (value !== undefined)
		{
			data.eventValue = value;
		}

		metricObject = metricObject || {};
		$.extend(data, metricObject);

		if (!location.href.match(".local"))
		{
			window.ga("send", "event", category, action, data);
		}
	}

	window.onerror = (error, filename, line, column, stackTrace) =>
	{
		try
		{
			if (typeof stackTrace != "undefined" && stackTrace != null)
			{
				var pathname = window.location.pathname;
				var errorInfo = stackTrace.stack;

				trackEvent("Errors", pathname, errorInfo);
			}
		}
		catch (e)
		{
		}
	}

	window.addEventListener("unhandledrejection",
		(event: any) =>
		{
			var info = `Unhandled rejection (reason: ${event.reason}).`;
			try {
				trackEvent("Errors", window.location.pathname, info, event.reason.stack);
			}
			catch (e) {
			}
		});

	$(document).ready(() =>
	{
		initializeSite();
	});
}