namespace Theater.MlbDataServer.Utils
{
	export class XmlLoader
	{
		public static async load<T>(url: string): Promise<T>
		{
			const proxyUrl = this.transformUrl(url);

			return new Promise((resolve: (value: T) => void, reject: (error: JQueryXHR) => void) =>
			{
				$.ajax({
					url: proxyUrl,
					type: "GET",
					dataType: "html",
					success: (response: T | string) =>
					{
						resolve(this.xmlToJson(response as string) as T);
					},
					error: (error) =>
					{
						reject(error);
					}
				});
			});
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