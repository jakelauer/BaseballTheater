namespace Theater.Utility
{
	export class Distributor<TPayload>
	{
		private subscriptions: Subscription<TPayload>[] = [];

		public subscribe(onUpdate: (payload: TPayload) => void)
		{
			const subscription = new Subscription<TPayload>(onUpdate);
			this.subscriptions.push(subscription);
		}

		public distribute(data: TPayload)
		{
			this.subscriptions.forEach(subscription => subscription.onUpdate(data));
		}
	}

	class Subscription<TPayload>
	{
		constructor(public onUpdate: (payload: TPayload) => void)
		{

		}
	}
}