export class PageData
{
	private static DATA_OBJ_NAME = "PAGE_DATA";

	public static getPageData<T>(key: string): T | null
	{
		const pageData = this.checkForPageData();
		if (pageData && key in pageData)
		{
			return pageData[key] as T;
		}

		console.warn(`${key} not found in PageData`);
		return null;
	}

	private static checkForPageData(): any | null
	{
		const pageData: any = (window as any)[this.DATA_OBJ_NAME];
		if (!pageData)
		{
			console.warn("PageData doesn't exist");
			return null;
		}
		return pageData;
	}
}
