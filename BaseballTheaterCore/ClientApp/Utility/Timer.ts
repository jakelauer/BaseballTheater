export class Timer
{
	private static timers: number[] = [];

	public static interval(callback: () => void, delayMs: number)
	{
		let startTime = Date.now(),
			timerId = startTime;
		
		this.timers.push(timerId);

		const run = () =>
		{
			const now = Date.now();
			const diff = now - startTime;
			const cancelled = this.timers.indexOf(timerId) === -1;

			if (diff > delayMs && !cancelled)
			{
				startTime = now;
				callback();
			}

			if (!cancelled)
			{
				requestAnimationFrame(() => run());
			}
		};

		run();

		return timerId;
	}

	public static cancel(timerId: number)
	{
		const index = this.timers.indexOf(timerId);
		if (index > -1)
		{
			this.timers.splice(index, 1);
		}
	}
}