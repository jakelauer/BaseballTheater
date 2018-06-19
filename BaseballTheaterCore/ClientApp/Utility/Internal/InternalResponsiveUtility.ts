class MediaQuery
{
	constructor(public readonly name: string, private readonly query: string)
	{
	}

	public test()
	{
		return window.matchMedia(this.query).matches;
	}
}

export class InternalResponsiveUtility
{
	private static mediaQueries: MediaQuery[] = [];

	public static max = new MediaQuery("max", "only screen");
	public static large = new MediaQuery("large", "only screen and (max-width : 1350px)");
	public static medium = new MediaQuery("medium", "only screen and (max-width : 980px)");
	public static mobile = new MediaQuery("mobile", "only screen and (max-width : 768px)");
	public static tiny = new MediaQuery("tiny", "only screen and (max-width : 480px)");

	public static initialize()
	{
		this.mediaQueries = [
			InternalResponsiveUtility.max,
			InternalResponsiveUtility.large,
			InternalResponsiveUtility.medium,
			InternalResponsiveUtility.mobile,
			InternalResponsiveUtility.tiny
		];
		this.determineMq();
		this.addListeners();
	};

	private static addListeners()
	{
		window.addEventListener("resize", () => this.determineMq());
	};

	public static determineMq()
	{
		const matchingClasses = [];
		const html = document.getElementsByTagName("html")[0];
		for (let mediaQuery of this.mediaQueries)
		{
			const stringClass = `r-${mediaQuery.name}`;
			if (mediaQuery.test())
			{
				html.classList.add(stringClass);
				matchingClasses.push(stringClass);
			}
			else
			{
				html.classList.remove(stringClass);
			}
		}
		
		return matchingClasses;
	};
}
