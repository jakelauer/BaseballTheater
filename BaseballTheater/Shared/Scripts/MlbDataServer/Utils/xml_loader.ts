namespace Theater.MlbDataServer.Utils
{
	export class XmlLoader
	{
		public static async load<T>(url: string): Promise<T>
		{
			return new Promise((resolve: (value: T) => void, reject: (error: JQueryXHR) => void) =>
			{
				$.ajax({
					url,
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
	}
}