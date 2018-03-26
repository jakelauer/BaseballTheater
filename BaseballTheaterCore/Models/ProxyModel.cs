namespace BaseballTheater.Areas.Proxy.Models
{
	public class ProxyModel
	{
		public string Data { get; set; }
		public bool IsJson { get; }

		public ProxyModel(string data, bool isJson)
		{
			this.Data = data;
			this.IsJson = isJson;
		}
	}
}