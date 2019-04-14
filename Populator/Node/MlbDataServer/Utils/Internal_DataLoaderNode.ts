import * as X2JS from "x2js";
import "abortcontroller-polyfill/dist/polyfill-patch-fetch";
import fetch, {Request} from 'node-fetch';

export default class Internal_DataLoaderNode
{
	private static requests: { [key: string]: AbortController } = {};

	private static async loadNode<T>(url: string, isJson: boolean, uniqueRequestType: string = ""): Promise<T>
	{
		const proxyUrl = this.transformUrl(url, isJson);

		const promise = new Promise((resolve: (value: any) => void, reject: (error: any) => void) => {

			let request = url;

			let resp = fetch(request);

			const catcher = (error: any) => {
				console.log("error", error);
				if (error.statusText === "abort")
				{
					return;
				}

				reject(error);
			};

			if (isJson)
			{
				resp.then((response) => response.json())
					.then((myJson) => {
						resolve(myJson);
					})
					.catch(catcher);
			}
			else
			{
				resp.then(response => response.text())
					.then((myText) => {
						resolve(myText);
					})
					.catch(catcher);
			}
		});

		return promise;
	}
	
	public static async loadJson<T>(url: string, uniqueRequestType: string = "")
	{
		const result = await this.loadNode<T>(url, true, uniqueRequestType);
		if (typeof result === "string")
		{
			if (result.length === 0)
			{
				return null;
			}
			return JSON.parse(result) as T;
		}

		return result as T;
	}

	public static async loadXml<T>(url: string, uniqueRequestType: string = "")
	{
		const result = await this.loadNode(url, false, uniqueRequestType);

		return this.xmlToJson(result as string) as T;
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
