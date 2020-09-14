import {useEffect, useRef, useState} from "react";
import {DataStore} from "../Global/Intercom/DataStore";

export const useDataStore = <T>(ds: DataStore<T>, onUpdate?: () => void) =>
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

export const usePrevious = <T>(value: T) =>
{
	// The ref object is a generic container whose current property is mutable ...
	// ... and can hold any value, similar to an instance property on a class
	const ref = useRef<T>();

	// Store current value in ref
	useEffect(() =>
	{
		ref.current = value;
	}, [value]); // Only re-run if value changes

	// Return previous value (happens before update in useEffect above)
	return ref.current;
};