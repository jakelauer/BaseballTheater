using System;
using System.Threading;
using System.Threading.Tasks;
using BaseballTheater.Hubs;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(BaseballTheater.Startup))]
namespace BaseballTheater
{
	public class Startup
	{
		public void Configuration(IAppBuilder app)
		{
			app.MapSignalR();
		}
	}
}
