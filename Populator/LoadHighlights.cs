using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using MlbDataServer.DataFetch;
using MlbDataServer.DataStructures;

namespace Populator
{
	internal class LoadHighlights
	{
		private DateTime Date { get; set; }
		private GameSummaryCreator Gsc { get; set; }

		private IEnumerable<LocalHighlight> TempList { get; set; }

		public LoadHighlights(DateTime date)
		{
			this.Date = date;
			this.Gsc = new GameSummaryCreator();
		}

		public void Process()
		{
			GameSummaryCollection summary = null;

			try
			{
				summary = this.Gsc.GetSummaryCollection(this.Date);
			}
			catch (Exception e)
			{

			}

			if (summary?.GameSummaries == null || summary.GameSummaries.Length == 0)
			{
				Logger.Log("Skipping " + this.Date);
				return;
			}

			var tempList = new List<LocalHighlight>();

			Logger.Log("Loading games for " + Date);

			foreach (var gameSummary in summary.GameSummaries)
			{

				var gdc = new GameDetailCreator(gameSummary.GameDataDirectory);
				HighlightsCollection highlights = null;

				try
				{
					highlights = gdc.GetHighlights();
				}
				catch (Exception e)
				{

				}

				if (highlights?.Highlights == null || highlights.Highlights.Length == 0)
				{
					continue;
				}

				foreach (var highlight in highlights.Highlights)
				{
					var pattern = @"\d{4}K";
					var link1200 = highlight.Urls.FirstOrDefault(a => Regex.IsMatch(a, pattern, RegexOptions.IgnoreCase));
					string link1800 = null;
					string link2500 = null;

					if (link1200 != null)
					{
						link1800 = Regex.Replace(link1200, pattern, "1800k", RegexOptions.IgnoreCase);
						link2500 = Regex.Replace(link1200, pattern, "2500k", RegexOptions.IgnoreCase);
					}

					var thumbDefault = highlight.Thumbs[highlight.Thumbs.Length - 1];
					var thumb_l = thumbDefault;
					var thumb_m = thumbDefault;
					var thumb_s = thumbDefault;
					
					if (highlight.Thumbs.Length > 4)
					{
						thumb_l = highlight.Thumbs[highlight.Thumbs.Length - 4];
					}
					if (highlight.Thumbs.Length > 3)
					{
						thumb_m = highlight.Thumbs[highlight.Thumbs.Length - 3];
					}
					if (highlight.Thumbs.Length > 4)
					{
						thumb_s = highlight.Thumbs[highlight.Thumbs.Length - 5];
					}

					var newLocalHighlight = new LocalHighlight
					{
						GameId = gameSummary.GamePk,
						Blurb = highlight.Blurb,
						BigBlurb = highlight.BigBlurb,
						Date = highlight.DateObj,
						Duration = highlight.Duration,
						Headline = highlight.Headline,
						Id = highlight.Id,
						Thumb_l = thumb_l,
						Thumb_m = thumb_m,
						Thumb_s = thumb_s,
						Video_l = link2500,
						Video_m = link1800,
						Video_s = link1200
					};

					if (highlight.Players != null)
					{
						newLocalHighlight.PlayerNames = highlight.Players.Names;
						newLocalHighlight.PlayerIds = highlight.Players.Ids;
					}

					if (highlight.Team != null)
					{
						newLocalHighlight.TeamId = highlight.Team.Id;
						newLocalHighlight.TeamName = highlight.Team.Name;
					}

					tempList.Add(newLocalHighlight);
				}
			}

			this.TempList = tempList;

			
			Logger.Log($"Inserting {tempList.Count} highlights");
			this.InsertAll();
		}

		private void InsertAll()
		{
			ConnectionStringSettings settings;
			settings = ConfigurationManager.ConnectionStrings["Bbt"];
			var connectionString = settings.ConnectionString;

			using (SqlConnection con = new SqlConnection(connectionString))
			{
				con.Open();
				foreach (var localHighlight in this.TempList)
				{
					if (localHighlight.Video_s == null)
					{
						continue;
					}

					try
					{
						using (SqlCommand cmd = new SqlCommand("dbo.insert_highlight", con))
						{
							cmd.CommandType = CommandType.StoredProcedure;

							cmd.Parameters.Add("@id", SqlDbType.BigInt).Value = localHighlight.Id;
							cmd.Parameters.Add("@datetime", SqlDbType.DateTime).Value = localHighlight.Date;
							cmd.Parameters.Add("@player_ids", SqlDbType.NVarChar).Value = localHighlight.PlayerIds;
							cmd.Parameters.Add("@player_names", SqlDbType.NVarChar).Value = localHighlight.PlayerNames;
							cmd.Parameters.Add("@team_id", SqlDbType.BigInt).Value = localHighlight.TeamId;
							cmd.Parameters.Add("@team_name", SqlDbType.NVarChar).Value = localHighlight.TeamName;
							cmd.Parameters.Add("@headline", SqlDbType.NVarChar).Value = localHighlight.Headline;
							cmd.Parameters.Add("@duration", SqlDbType.NVarChar).Value = localHighlight.Duration;
							cmd.Parameters.Add("@blurb", SqlDbType.NVarChar).Value = localHighlight.Blurb;
							cmd.Parameters.Add("@bigblurb", SqlDbType.NVarChar).Value = localHighlight.BigBlurb;
							cmd.Parameters.Add("@thumb_s", SqlDbType.NVarChar).Value = localHighlight.Thumb_s;
							cmd.Parameters.Add("@thumb_m", SqlDbType.NVarChar).Value = localHighlight.Thumb_m;
							cmd.Parameters.Add("@thumb_l", SqlDbType.NVarChar).Value = localHighlight.Thumb_l;
							cmd.Parameters.Add("@video_s", SqlDbType.NVarChar).Value = localHighlight.Video_s;
							cmd.Parameters.Add("@video_m", SqlDbType.NVarChar).Value = localHighlight.Video_m;
							cmd.Parameters.Add("@video_l", SqlDbType.NVarChar).Value = localHighlight.Video_l;
							cmd.Parameters.Add("@gameid", SqlDbType.BigInt).Value = localHighlight.GameId;

							cmd.ExecuteNonQuery();
						}
					}    
					catch (Exception ex)
					{
						if (!ex.Message.Contains("PRIMARY KEY"))
						{
							con.Close();
							throw ex; //TODO: Please log it or remove the catch
						}
					}
				}
			}

			Logger.Log("Date complete");
		}
	}
}