namespace Theater.MlbDataServer.Utils
{
	export class XmlLoader
	{
		private static requests: { [key: string]: JQueryXHR} = {};

		public static async load<T>(url: string, uniqueRequestType: string = ""): Promise<T>
		{
			console.debug(`Request for ${url}`);

			const proxyUrl = this.transformUrl(url);

			if (uniqueRequestType && uniqueRequestType in this.requests)
			{
				console.warn(`Aborting existing request of type ${uniqueRequestType}`);

				const existingRequest = this.requests[uniqueRequestType];
				existingRequest.abort();

				delete this.requests[uniqueRequestType];
			}

			let ajaxRequest: JQueryXHR;
			const promise = new Promise((resolve: (value: T) => void, reject: (error: JQueryXHR) => void) =>
			{
				ajaxRequest = $.ajax({
					url: proxyUrl,
					type: "GET",
					dataType: "html",
					success: (response: T | string) =>
					{
						resolve(this.xmlToJson(response as string) as T);
					},
					error: (error) =>
					{
						if (error.statusText === "abort")
						{
							return;
						}

						reject(error);
					}
				});
			});

			if (uniqueRequestType)
			{
				console.debug(`Setting unique request of type ${uniqueRequestType}`);
				this.requests[uniqueRequestType] = ajaxRequest;

				promise.then(() =>
				{
					delete this.requests[uniqueRequestType];
				});
			}

			return promise;
		}

		private static xmlToJson(xmlString: string)
		{
			const x2js = new X2JS({
			    attributePrefix: ""
			});
			const json = x2js.xml_str2json(xmlString);
			return json;
		}

		private static transformUrl(url: string)
		{
			const encodedUrl = encodeURIComponent(url);
			const proxyUrl = `/Proxy?mlbUrl=${encodedUrl}`;
			return proxyUrl;
		}
	}
}