namespace BaseballTheater.Areas.Proxy.Models
{
	public class ProxyModel
	{
		public string XML { get; set; }
		public bool IsJson { get; }

		public ProxyModel(string xml, bool isJson)
		{
			this.XML = xml;
			this.IsJson = isJson;
		}
	}
}