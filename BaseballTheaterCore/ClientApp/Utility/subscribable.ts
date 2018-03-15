export class Distributor<TPayload>
{
	private subscriptions: Subscription<TPayload>[] = [];

	public subscribe(onUpdate: (payload: TPayload) => void)
	{
		const subscription = new Subscription<TPayload>(onUpdate);
		this.subscriptions.push(subscription);
		return subscription;
	}

	public distribute(data: TPayload)
	{
		this.subscriptions.forEach(subscription => subscription.onUpdate(data));
	}

	public unsubscribe(subscription: Subscription<TPayload>)
	{
		const index = this.subscriptions.indexOf(subscription);
		if (index > -1)
		{
			this.subscriptions.splice(index, 1);
		}
	}
}

export class Subscription<TPayload>
{
	constructor(public onUpdate: (payload: TPayload) => void)
	{

	}
}
