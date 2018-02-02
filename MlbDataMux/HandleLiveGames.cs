using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using Common;
using MlbDataServer.DataFetch;
using MlbDataServer.DataStructures;

namespace MlbDataMux
{
	public class HandleLiveGames
	{
		private readonly DateTime
			_date = DateTime.ParseExact("20170727", "yyyyMMdd", CultureInfo.InvariantCulture); //DateTime.UtcNow;

		private DateTime lastCheckedDate { get; set; }

		private int checkIntervalSeconds { get; }
		private GameSummaryCreator gsc { get; }
		private Action<IEnumerable<int>> onUpdateGames { get; }

		private GameSummaryCollection summaryCollection { get; set; }
		private IEnumerable<DateTime> activeGameTimes { get; set; }
		private Timer checkGamesTimer { get; set; }


		private bool isActive { get; set; }

		public HandleLiveGames(int checkIntervalSeconds, Action<IEnumerable<int>> onUpdateGames)
		{
			this.gsc = new GameSummaryCreator();
			this.checkIntervalSeconds = checkIntervalSeconds;
			this.onUpdateGames = onUpdateGames;
		}

		public void Start()
		{
			this.isActive = true;

			ThreadPool.QueueUserWorkItem(this.CheckGames, null);
		}

		private void End()
		{
			this.isActive = false;
		}

		private void CheckGames(object _ = null)
		{
			this.checkGamesTimer?.Dispose();

			if (summaryCollection == null)
			{
				try
				{
					summaryCollection = this.gsc.GetSummaryCollection(this._date);
				}
				catch (Exception)
				{

				}
			}

			if (summaryCollection?.GameSummaries == null || !summaryCollection.GameSummaries.Any())
			{
				Logger.Log("Games not found");
				return;
			}

			if (this.activeGameTimes == null)
			{
				this.activeGameTimes = summaryCollection.GameSummaries
					.OrderByDescending(a => a.DateObj)
					.Select(game => game.DateObj.AddMinutes(-15));
			}

			var firstGameTime = this.activeGameTimes.First();
			var now = firstGameTime.AddMinutes(5);
			//var now = DateTime.UtcNow;
			var timeUntilFirstGame = firstGameTime - now;

			// Wait until 15 minutes before the first game of the day to check
			if (timeUntilFirstGame.TotalMinutes > 0)
			{
				this.checkGamesTimer =
					new Timer((a) => CheckGames(), null, Convert.ToInt32(timeUntilFirstGame.TotalMilliseconds), 0);
				return;
			}

			this.GetGameUpdates();
		}

		private void GetGameUpdates()
		{
			var activeGames = summaryCollection.GameSummaries
				.Where(a =>
					a.Id == ""
					/*a.Status?.Status != "F" 
					&& a.Status?.Status != "Final"*/
					&& a.DateObj.AddMinutes(-15) < DateTime.UtcNow)
				.ToArray();

			var gamesToBroadcast = new List<int>();

			foreach (var game in activeGames)
			{
				var gdc = new GameDetailCreator(game.GameDataDirectory);
				var headers = gdc.GetGameCenterHeaders();
				var lastModifiedHeader = headers.TryGetValueOrDefault("Last-Modified");
				if (lastModifiedHeader != null)
				{
					var lastModified = DateTime.Parse(lastModifiedHeader);
					if (lastModified > this.lastCheckedDate)
					{
						gamesToBroadcast.Add(game.GamePk);
					}
				}
			}

			if (gamesToBroadcast.Count < 0)
			{
				this.onUpdateGames(gamesToBroadcast);
			}

			if (!activeGames.Any())
			{
				End();
			}
			else
			{
				checkGamesTimer = new Timer((a) => CheckGames(), null, 10 * 1000, 0);
			}

			this.lastCheckedDate = DateTime.UtcNow;
		}
	}
}