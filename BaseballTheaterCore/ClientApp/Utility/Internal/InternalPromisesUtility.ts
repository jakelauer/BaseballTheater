export class InternalPromisesUtility
{
	public static async all<T>(promises: Promise<T | Error>[])
	{
		const p = new Promise<(T | Error)[]>((resolve, reject) =>
		{
			const results: (T | Error)[] = [];
			let count = 0;
			promises.forEach((promise, idx) =>
			{
				promise
					.catch((err: Error) =>
					{
						return err;
					})
					.then(valueOrError =>
					{
						results[idx] = valueOrError;
						count += 1;
						if (count === promises.length)
						{
							resolve(results);
						}
					});
			});
		});

		const allResults = await p;

		return allResults;
	}

}
