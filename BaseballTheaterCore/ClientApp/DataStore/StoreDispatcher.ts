export abstract class StoreDispatcher<TPayload>
{
	constructor(private _state: TPayload)
	{

	}

	public get state()
	{
		return this._state;
	}

	private waiters: { [key: string]: (payload: TPayload) => void } = {};

	public update<K extends keyof TPayload>(state: Pick<TPayload, K>)
	{
		this._state = Object.assign({}, this._state, state) as TPayload;

		for (let key in this.waiters)
		{
			this.updateForKey(key);
		}
	}

	private updateForKey(key: string)
	{
		this.waiters[key](this._state);
	}

	public register(callback: (payload: TPayload) => void)
	{
		const key = Date.now().toString();
		this.waiters[key] = callback;
		this.updateForKey(key);
		return key;
	}

	public deregister(key: string)
	{
		delete this.waiters[key];
	}
}