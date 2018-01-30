using System.Collections.Generic;

namespace Common
{
	public static class DictionaryExtensions
	{
		public static U TryGetValueOrDefault<T, U>(this IDictionary<T, U> dict, T key)
		{
			return dict.TryGetValue(key, out var temp) ? temp : default(U);
		}
	}
}