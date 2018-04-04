export class Animate
{
	public static scrollTop(targetPx: number, durationMs: number = 250)
	{
		const currentScroll = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
		const scrollDiff = currentScroll - targetPx;

		const start = Date.now();
		const animateFunc = () =>
		{
			const now = Date.now();
			const diff = now - start;
			const pct = Math.min(1, diff / durationMs);
			const tweenTargetPx = (scrollDiff * pct) + currentScroll;
			window.scrollTo(0, tweenTargetPx);

			if (pct < 1)
			{
				window.requestAnimationFrame(() => animateFunc());
			}
		};

		animateFunc();
	}
}