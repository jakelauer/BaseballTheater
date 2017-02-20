namespace Theater.Site
{
	export abstract class Page
	{
		public abstract initialize();
		public abstract dataBind();
		public abstract renew(pathname: string);
		public abstract destroy();
	}

	export interface IPageParams
	{
		bodySelector: string;
		matchingUrl: RegExp;
		page: Page;
	}
}