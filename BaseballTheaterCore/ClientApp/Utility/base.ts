export class DataUtility
{
	public static forceArray<T>(item: T | T[])
	{
		return item instanceof Array ? item : [item as T];
	}
}
