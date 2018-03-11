using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using Common;
using MlbDataServer.Contracts;
using MlbDataServer.Engine;

namespace MlbDataMux
{
	public class HandleLiveGames
	{
		private static readonly log4net.ILog log =
			log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

		private readonly DateTime
			_date = DateTime.UtcNow.AddHours(-5);

		private DateTime lastCheckedDate { get; set; }

		private int checkIntervalSeconds { get; }
		private GameSummaryCreator gsc { get; }
		private Action<IEnumerable<int>> onUpdateGames { get; }

		private List<GameSummary> allGameSummaries { get; set; }
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

			Logger.Log("HandleLiveGames Started");

			ThreadPool.QueueUserWorkItem(this.CheckGames, null);
		}

		private void End()
		{
			this.isActive = false;
			Logger.Log("HandleLiveGames Ended");
		}

		private void CheckGames(object _ = null)
		{
			Logger.Log("CheckGames");

			this.checkGamesTimer?.Dispose();

			GameSummaryCollection summaryCollectionToday = null;
			GameSummaryCollection summaryCollectionYesterday = null;

			try
			{
				summaryCollectionToday = this.gsc.GetSummaryCollection(this._date);
			}
			catch (Exception)
			{
				// ignored
			}

			try
			{
				summaryCollectionYesterday = this.gsc.GetSummaryCollection(this._date.AddDays(-1));
			}
			catch (Exception)
			{
				// ignored
			}

			var todayGameSummaries = summaryCollectionToday?.GameSummaries?.ToList() ?? new List<GameSummary>();
			var yesterdayGameSummaries = summaryCollectionYesterday?.GameSummaries?.ToList() ?? new List<GameSummary>();

			var todayHasGames = todayGameSummaries.Any();
			var yesterdayHasGames = yesterdayGameSummaries.Any();

			if (!todayHasGames && !yesterdayHasGames)
			{
				Logger.Log("Games not found");
				return;
			}

			allGameSummaries = new List<GameSummary>();
			allGameSummaries.AddRange(todayGameSummaries);
			allGameSummaries.AddRange(yesterdayGameSummaries);

			if (this.activeGameTimes == null)
			{
				this.activeGameTimes = allGameSummaries
					.OrderBy(a => a.DateObjUtc)
					.Select(game => game.DateObjUtc.AddMinutes(-15));
			}

			var firstGameTime = this.activeGameTimes.First();
			//var now = firstGameTime.AddMinutes(5);
			var now = DateTime.UtcNow;
			var timeUntilFirstGame = firstGameTime - now;

			// Wait until 15 minutes before the first game of the day to check
			if (timeUntilFirstGame.TotalMinutes > 0)
			{
				this.StartCheckDelay(timeUntilFirstGame);

				return;
			}

			this.GetGameUpdates();
		}

		private void StartCheckDelay(TimeSpan requestedWaitTime)
		{
			var maximumWaitTime = new TimeSpan(1, 0, 0);
			var waitTime = requestedWaitTime > maximumWaitTime
				? maximumWaitTime
				: requestedWaitTime;

			Logger.Log(
				$"Requested to wait {requestedWaitTime:dd\\.hh\\:mm\\:ss} to start checking again, actual wait time {waitTime:dd\\.hh\\:mm\\:ss}");


			this.checkGamesTimer =
				new Timer((a) => CheckGames(), null, Convert.ToInt32(waitTime.TotalMilliseconds), 0);
		}

		private void GetGameUpdates()
		{
			var activeGames = allGameSummaries
				.Where(a =>
					//a.Id == ""
						a.Status?.Status != "F"
						&& a.Status?.Status != "Final"
						&& a.DateObjUtc.AddMinutes(-15) < DateTime.UtcNow).ToList();

			var gamesToBroadcast = new List<int>();

			Logger.Log($"Total games: {allGameSummaries.Count}, Active games: {activeGames.Count}");

			foreach (var game in activeGames)
			{
				var gdc = new GameDetailCreator(game.GameDataDirectory);
				var headers = gdc.GetGameCenterHeaders();
				var lastModifiedHeader = headers.TryGetValueOrDefault("Last-Modified");
				if (lastModifiedHeader != null)
				{
					var lastModified = DateTime.Parse(lastModifiedHeader);
					if (lastModified > this.lastCheckedDate || true)
					{
						gamesToBroadcast.Add(game.GamePk);
					}
				}
			}

			if (gamesToBroadcast.Count > 0)
			{
				Logger.Log($"Broadcasting updates for {string.Join(",", gamesToBroadcast)}");
				this.onUpdateGames(gamesToBroadcast);
			}

			if (!activeGames.Any())
			{
				//End();
				var now = DateTime.UtcNow;
				var tomorrow = now.AddDays(1).Date;

				this.StartCheckDelay(tomorrow - now);
			}
			else
			{
				checkGamesTimer = new Timer((a) => CheckGames(), null, 10 * 1000, 0);
			}

			this.lastCheckedDate = DateTime.UtcNow;
		}
	}
}