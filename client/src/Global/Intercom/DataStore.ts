import { useEffect, useState } from 'react';

import { DataStoreObserver } from './DataStoreObserver';

export abstract class DataStore<TState extends any,
	TObserverParams extends {} = never>
{
	protected _currentState: TState;
	private readonly _observers: DataStoreObserver<TState, TObserverParams>[] = [];

	protected constructor(initialState: TState)
	{
		this._currentState = initialState;
	}

	protected update(data: Partial<TState>)
	{
		this._currentState = this.getNewState(data);
		this.broadcast();
	}

	protected getNewState(data: Partial<TState>): TState
	{
		return {...this._currentState as any, ...data};
	}

	protected broadcast()
	{
		const toUpdate = this.selectListenersForUpdate();
		toUpdate.forEach(listener => listener.callback(this._currentState));
	}

	protected selectListenersForUpdate()
	{
		return this._observers;
	}

	public listen(callback: (data: TState) => void, params?: TObserverParams, callbackOnListen = true)
	{
		const observer = new DataStoreObserver(callback, params);

		this._observers.push(observer);

		if (callbackOnListen)
		{
			observer.callback(this._currentState);
		}

		return () =>
		{
			this._observers.splice(this._observers.indexOf(observer), 1)
		};
	}

	public get state()
	{
		return this._currentState;
	}
}

export const useDataStore = <T extends any, U extends {} = {}>(ds: DataStore<T, U>, onUpdate?: () => void) =>
{
	const [current, setCurrent] = useState(ds.state);

	useEffect(() =>
	{
		const destroy = ds.listen(data =>
		{
			setCurrent(data);
			onUpdate?.();
		});

		return () => destroy();
	}, []);

	return current;
};
