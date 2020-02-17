import "abortcontroller-polyfill/dist/polyfill-patch-fetch";

class Internal_DataLoader
{
	public static Instance = new Internal_DataLoader();

	private requests: { [key: string]: AbortController } = {};

	public async load<T>(
		url: string,
		uniqueRequestType: string = ""
	): Promise<T>
	{
		const proxyUrl = this.transformUrl(url);

		if (uniqueRequestType && uniqueRequestType in this.requests)
		{
			console.warn(`Aborting existing request of type ${uniqueRequestType}`);

			const existingRequest = this.requests[uniqueRequestType];
			existingRequest.abort();

			delete this.requests[uniqueRequestType];
		}

		const promise = new Promise((resolve: (value: any) => void, reject: (error: any) => void) =>
		{
			const controller = new AbortController();
			const signal = controller.signal;
			const request = new Request(proxyUrl, {signal});

			fetch(request)
				.then((response: Response) => response.json())
				.then((myJson: any) => resolve(myJson))
				.catch((error: any) =>
				{
					if (error.statusText === "abort")
					{
						return;
					}

					reject(error);
				});

			if (uniqueRequestType)
			{
				this.requests[uniqueRequestType] = controller;
			}
		});

		await promise.then(() =>
		{
			delete this.requests[uniqueRequestType];
		});

		return promise;
	}

	public transformUrl = (url: string) =>
	{
		return url;
	}
}

export default Internal_DataLoader.Instance;