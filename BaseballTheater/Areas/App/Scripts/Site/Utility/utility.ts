namespace Theater.Utility
{
	export function forceArray<T>(item: T | T[])
	{
		return item instanceof Array ? item : [item as T];
	}
}