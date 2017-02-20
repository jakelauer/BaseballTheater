namespace Theater.Site
{
	var pages: { [bodySelector: string]: IPageParams } = {};
	var initializeCurrentPage: () => void;
	var initializeSite: () => void;

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

		for (var bodySelector in pages)
		{
			if (pages.hasOwnProperty(bodySelector))
			{
				if ($("body").is(bodySelector))
				{
					let page = pages[bodySelector].page;
					currentPage = pages[bodySelector];
					page.initialize();
					page.dataBind();
				}
			}
		}
	};

	export var addPage = (params: IPageParams) =>
	{
		pages[params.bodySelector] = params;
	};

	$(document).on("ready newPageCreated", () =>
	{
		initializeSite();
	});
}