import "abortcontroller-polyfill/dist/polyfill-patch-fetch";
import fetch from "node-fetch";

class Internal_DataLoaderNode
{
	public static Instance = new Internal_DataLoaderNode();

	private async loadNode<T>(url: string, uniqueRequestType: string = ""): Promise<T>
	{
		return new Promise((resolve: (value: any) => void, reject: (error: any) => void) =>
		{
			let resp = fetch(url);

			const catcher = (error: any) =>
			{
				console.log("error", error);
				if (error.statusText === "abort")
				{
					return;
				}

				reject(error);
			};

			resp
				.then(response => response.json())
				.then(myJson =>
				{
					resolve(myJson);
				})
				.catch(catcher);
		});
	}

	public async load<T>(url: string, uniqueRequestType: string = ""): Promise<T>
	{
		const result = await this.loadNode<T>(url, uniqueRequestType);
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
}

export default Internal_DataLoaderNode.Instance;