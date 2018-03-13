using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace BaseballTheater.Hubs
{
	public class LiveGameHub : Hub
	{
		public static IHubConnectionContext<dynamic> ClientsInstance => GlobalHost.ConnectionManager.GetHubContext<LiveGameHub>().Clients;

		public void Send(string message)
		{
			Clients.All.receive(message);
		}
	}
}