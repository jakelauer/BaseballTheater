namespace Theater
{
	var siteLoadingTimeout = 0;
	export var isLoading = false;

	export var currentPage: IPageRegister = null;

	/*export var startLoading = () =>
	{
		clearTimeout(siteLoadingTimeout);
		siteLoadingTimeout = setTimeout(() =>
			{
				$("#body-wrapper").addClass("loading");
			},
			100);
		isLoading = true;
	};

	export var stopLoading = () =>
	{
		clearTimeout(siteLoadingTimeout);
		$("#body-wrapper").removeClass("loading");
		isLoading = false;
	};*/

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
}