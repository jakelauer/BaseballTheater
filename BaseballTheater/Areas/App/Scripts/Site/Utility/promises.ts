namespace Theater
{
	export class Promises
	{
		public static async all(promises: Promise<any>[])
		{
			const p = new Promise<(any | Error)[]>((resolve, reject) =>
			{
				const results: (any | Error)[] = [];
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
}