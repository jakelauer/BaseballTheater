export class StringUtils
{
	public static splitCamelCaseToString(s: string)
	{
		return s.replace(/(?=([A-Z]){1}([a-z]){1})/g, " ");
	}

	public static dashedToProperCase(s: string)
	{
		return StringUtils.toProperCase(s.replace(/-/g, " "));
	}

	public static toProperCase = (s: string) =>
	{
		return s.replace(/(^[a-z])|(\s+[a-z])/g, txt => txt.toUpperCase());
	};
}