import {DataStoreObserver} from "./DataStoreObserver";

export abstract class DataStore<TState extends {},
	TObserverParams extends {} = never>
{
	private _currentState: TState;
	private readonly _observers: DataStoreObserver<TState, TObserverParams>[] = [];

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
		return this._observers;
	}

	public listen(callback: (data: TState) => void, params: TObserverParams = undefined)
	{
		const observer = new DataStoreObserver(callback, params);

		this._observers.push(observer);

		observer.callback(this._currentState);
	}

	public get state()
	{
		return this._currentState;
	}
}