export class InternalDataUtility
{
	public static forceArray<T>(item: T | T[])
	{
		return item instanceof Array ? item : [item as T];
	}
}
