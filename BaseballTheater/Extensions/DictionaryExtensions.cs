using System.Collections.Generic;

namespace BaseballTheater.Extensions
{
	public static class DictionaryExtensions
	{
		public static U TryGetValueOrDefault<T, U>(this IDictionary<T, U> dict, T key)
		{
			U temp;

			if (dict.TryGetValue(key, out temp))
				return temp;

			return default(U);
		}
	}
}