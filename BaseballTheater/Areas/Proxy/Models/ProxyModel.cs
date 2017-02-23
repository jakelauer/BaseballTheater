namespace BaseballTheater.Areas.Proxy.Models
{
	public class ProxyModel
	{
		public string XML { get; set; }

		public ProxyModel(string xml)
		{
			this.XML = xml;
		}
	}
}