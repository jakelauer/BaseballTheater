namespace Theater.Utility
{
	class MediaQuery
	{
		constructor(public readonly name: string, private readonly query: string)
		{
		}

		public test()
		{
			return Modernizr.mq(this.query);
		}
	}

	export class Responsive
	{
		public static Instance = new Responsive();

		private mediaQueries: MediaQuery[] = [];

		public static max = new MediaQuery("max", "only screen");
		public static large = new MediaQuery("large", "only screen and (max-width : 1350px)");
		public static medium = new MediaQuery("medium", "only screen and (max-width : 980px)");
		public static mobile = new MediaQuery("mobile", "only screen and (max-width : 768px)");
		public static tiny = new MediaQuery("tiny", "only screen and (max-width : 480px)");

		public initialize()
		{
			this.mediaQueries = [
				Responsive.max,
				Responsive.large,
				Responsive.medium,
				Responsive.mobile,
				Responsive.tiny
			];
			this.determineMq();
			this.addListeners();
		};

		private addListeners()
		{
			$(window).on("resize",
				() =>
				{
					this.determineMq();
				});
		};

		private determineMq()
		{
			for (let mediaQuery of this.mediaQueries)
			{
				const stringClass = `r-${mediaQuery.name}`;
				$("html").toggleClass(stringClass, mediaQuery.test());
			}
		};
	}
}