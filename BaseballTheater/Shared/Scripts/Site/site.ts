namespace Theater.Site
{
	var pages: IPageParams[] = [];
	var initializedPages: IPageParams[] = [];
	export var initializeCurrentPage: () => void;
	var initializeSite: () => void;
	var siteLoadingTimeout = 0;

	export var currentPage: IPageParams = null;

	initializeSite = () =>
	{
		Site.GlobalComponents.registerComponents();
		Site.LinkHandler.Instance.initialize();
		initializeCurrentPage();
	}

	initializeCurrentPage = () =>
	{
		if (currentPage !== null)
		{
			currentPage.page.destroy();
		}

		for (var page of pages)
		{
			if(page.matchingUrl.test(location.pathname))
			{
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
		}, 250);
	};

	export var stopLoading = () =>
	{
		clearTimeout(siteLoadingTimeout);
		$("#body-wrapper").removeClass("loading");
	};

	$(document).on("ready", () =>
	{
		initializeSite();
	});
}