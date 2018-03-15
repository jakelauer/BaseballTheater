import "jquery"
declare var X2JS: IX2JS;

export class DataLoader
{
	private static requests: { [key: string]: JQueryXHR } = {};

	private static async load<T>(url: string, isJson: boolean, uniqueRequestType: string = "")
	{
		const proxyUrl = this.transformUrl(url, isJson);

		if (uniqueRequestType && uniqueRequestType in this.requests)
		{
			console.warn(`Aborting existing request of type ${uniqueRequestType}`);

			const existingRequest = this.requests[uniqueRequestType];
			existingRequest.abort();

			delete this.requests[uniqueRequestType];
		}

		const dataType = isJson ? "json" : "html";

		let ajaxRequest: JQueryXHR;
		const promise = new Promise((resolve: (value: any) => void, reject: (error: JQueryXHR) => void) =>
		{
			ajaxRequest = $.ajax({
				url: proxyUrl,
				type: "GET",
				dataType: dataType,
				success: (response) =>
				{
					resolve(response);
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

			if (uniqueRequestType)
			{
				//console.debug(`Setting unique request of type ${uniqueRequestType}`);
				this.requests[uniqueRequestType] = ajaxRequest;
			}
		});

		promise.then(() =>
		{
			delete this.requests[uniqueRequestType];
		});

		return promise;
	}

	public static async loadJson<T>(url: string, uniqueRequestType: string = "")
	{
		const result = await this.load(url, true, uniqueRequestType);
		if (typeof result === "string")
		{
			return JSON.parse(result) as T;
		}

		return result as T;
	}

	public static async loadXml<T>(url: string, uniqueRequestType: string = "")
	{
		const result = await this.load(url, false, uniqueRequestType);
		return this.xmlToJson(result as string) as T
	}

	private static xmlToJson(xmlString: string)
	{
		const x2js = new X2JS({
			attributePrefix: ""
		});
		const json = x2js.xml_str2json(xmlString);
		return json;
	}

	private static transformUrl(url: string, isJson: boolean)
	{
		const encodedUrl = encodeURIComponent(url);
		const proxyUrl = `/Proxy?mlbUrl=${encodedUrl}&isJson=${isJson}`;
		return proxyUrl;
	}
}
