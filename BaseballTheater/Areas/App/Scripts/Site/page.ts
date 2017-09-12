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
		matchingUrl: RegExp;
		page: Page;
		name: string;
	}
}