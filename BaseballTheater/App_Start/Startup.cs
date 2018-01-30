using System;
using System.Threading;
using System.Threading.Tasks;
using BaseballTheater.Hubs;
using Microsoft.Owin;
using MlbDataMux;
using Owin;

[assembly: OwinStartup(typeof(BaseballTheater.Startup))]
namespace BaseballTheater
{
	public class Startup
	{
		public void Configuration(IAppBuilder app)
		{
			app.MapSignalR();

			DoGameUpdates();
		}

		private void DoGameUpdates()
		{
			var handleLiveGames = new HandleLiveGames(10, (games) => { LiveGameHub.ClientsInstance.All.receive(games); });
			handleLiveGames.Start();

			LiveGameHub.ClientsInstance.All.receive("lol");
		}
	}
}
