namespace Theater
{
	export var startTime: moment.Moment;
	export var endTime: moment.Moment;

	export enum NetSpeed
	{
		Slow,
		Medium,
		Fast
	}

	export class Global
	{
		public static Instance = new Global();

		public static now = moment();

		public static get clientNetSpeed()
		{
			if (endTime)
			{
				const diff = endTime.diff(startTime);

				if (diff > 2000)
				{
					return NetSpeed.Slow;
				}
				else if (diff > 1000)
				{
					return NetSpeed.Medium;
				}
			}

			return NetSpeed.Fast;
		}

		public static startLoading()
		{

		}

		public static stopLoading()
		{

		}

		public initialize()
		{
			$("html").addClass("ready");
		}
		

		public static getTitle(title: string)
		{
			return `${title} - Baseball Theater`;
		}
	}
}