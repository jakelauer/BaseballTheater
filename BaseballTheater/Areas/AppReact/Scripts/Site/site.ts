namespace Theater.SiteReact
{
	var pages: IReactPageRegister[] = [];
	export var initializeCurrentPage: () => void;
	var initializeSite: () => void;
	var siteLoadingTimeout = 0;
	export var isLoading = false;

	export var currentPage: IReactPageRegister = null;

	initializeSite = () =>
	{
		LinkHandler.Instance.initialize();
		initializeCurrentPage();

		Responsive.Instance.initialize();

		$(".mobile-menu-trigger").on("click", () =>
		{
			$("header .links").toggleClass("open");
		});
	}

	initializeCurrentPage = () =>
	{
		$(window).scrollTop(0);

		$(".links a").removeClass("active");

		for (let page of pages)
		{
			if (page.matchingUrl.test(location.pathname))
			{
				if (currentPage === page)
				{
				}

				ReactDOM.render(
					page.page,
					document.getElementById("body-content")
				);

				currentPage = page;
			}
		}
	};

	export var addPage = (params: IReactPageRegister) =>
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