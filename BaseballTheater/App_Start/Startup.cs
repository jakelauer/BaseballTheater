using System;
using System.Threading;
using System.Threading.Tasks;
using BaseballTheater.Hubs;
using Microsoft.Owin;
using MlbDataMux;
using Owin;

[assembly: OwinStartup(typeof(BaseballTheater.Startup), "Configuration")]
namespace BaseballTheater
{
	public class Startup
	{
		private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

		public void Configuration(IAppBuilder app)
		{
			app.MapSignalR();

			DoGameUpdates();
		}

		private void DoGameUpdates()
		{
			log.Info("Running DoGameUpdates");

			var handleLiveGames = new HandleLiveGames(10, (games) =>
			{
				LiveGameHub.ClientsInstance.All.receive(games); 
			});
			handleLiveGames.Start();
		}
	}
}
