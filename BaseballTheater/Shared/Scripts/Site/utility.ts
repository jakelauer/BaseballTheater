namespace Theater
{
	export class Utility
	{
		public static endsWith(haystack: string, needle: string, position?: number)
		{
			var subjectString = haystack;
			if (typeof position !== "number" || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length)
			{
				position = subjectString.length;
			}
			position -= needle.length;
			var lastIndex = subjectString.lastIndexOf(needle, position);
			return (lastIndex !== -1 && lastIndex === position) as boolean;
		}
	}
}