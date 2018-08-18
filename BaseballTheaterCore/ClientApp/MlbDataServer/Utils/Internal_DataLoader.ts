import * as X2JS from "x2js";
import "abortcontroller-polyfill/dist/polyfill-patch-fetch";

interface ProxyModel<T>
{
	isJson: boolean;
	data: T;
}

export default class Internal_DataLoader
{
	private static requests: { [key: string]: AbortController } = {};

	private static async load<T>(url: string, isJson: boolean, uniqueRequestType: string = ""): Promise<ProxyModel<T>>
	{
		const proxyUrl = this.transformUrl(url, isJson);

		if (uniqueRequestType && uniqueRequestType in this.requests)
		{
			console.warn(`Aborting existing request of type ${uniqueRequestType}`);

			const existingRequest = this.requests[uniqueRequestType];
			existingRequest.abort();

			delete this.requests[uniqueRequestType];
		}

		const promise = new Promise((resolve: (value: any) => void, reject: (error: any) => void) => {
			const controller = new AbortController();
			const signal = controller.signal;
			const request = new Request(proxyUrl, {signal});

			fetch(request)
				.then((response: Response) => response.json())
				.then((myJson: any) => resolve(myJson))
				.catch((error: any) => {
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

		promise.then(() => {
			delete this.requests[uniqueRequestType];
		});

		return promise;
	}

	public static async loadJson<T>(url: string, uniqueRequestType: string = "")
	{
		const result = await this.load<T>(url, true, uniqueRequestType);
		if (typeof result.data === "string")
		{
			if (result.data.length === 0)
			{
				return null;
			}
			return JSON.parse(result.data) as T;
		}

		return result.data as T;
	}

	public static async loadXml<T>(url: string, uniqueRequestType: string = "")
	{
		const result = await this.load(url, false, uniqueRequestType);

		let objResult;
		if (typeof result === "string")
		{
			objResult = JSON.parse(result) as any;
		}
		else
		{
			objResult = result;
		}

		return this.xmlToJson(objResult.data as string) as T;
	}

	private static xmlToJson(xmlString: string)
	{
		const x = new X2JS({
			attributePrefix: ""
		});
		return x.xml2js(xmlString);
	}

	private static transformUrl(url: string, isJson: boolean)
	{
		const encodedUrl = encodeURIComponent(url);
		return `/api/Proxy/Get?mlbUrl=${encodedUrl}&isJson=${isJson}`;
	}
}
