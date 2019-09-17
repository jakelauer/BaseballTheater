import {IntercomListener} from "./IntercomListener";

export abstract class Intercom<TState extends {},
	TListenerParams extends {} = never>
{
	private _currentState: TState;
	private readonly _listeners: IntercomListener<TState, TListenerParams>[] = [];

	protected constructor(initialState: TState)
	{
		this._currentState = initialState;
	}

	protected update(data: Partial<TState>)
	{
		this._currentState = Object.assign(this._currentState, data) as TState;
		this.broadcast();
	}

	private broadcast()
	{
		const toUpdate = this.selectListenersForUpdate();
		toUpdate.forEach(listener => listener.callback(this._currentState));
	}

	protected selectListenersForUpdate()
	{
		return this._listeners;
	}

	public listen(callback: (data: TState) => void, params: TListenerParams = undefined)
	{
		const listener = new IntercomListener(callback, params);

		this._listeners.push(listener);
	}

	public get current()
	{
		return this._currentState;
	}
}