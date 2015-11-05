using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using MlbDataServer;
using MlbDataServer.DataFetch;
using MlbDataServer.DataStructures;
using RedditBot.Config;
using RedditSharp;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;

namespace RedditBot
{
	class RedditAccess
	{
		private readonly Reddit _reddit = new Reddit();
		private List<string> _commentIds = new List<string>();
		private List<string> _newCommentIds = new List<string>();
		private const string CommentIdFilePath = "http://jakelauer.blob.core.windows.net/ids/ids.txt";

		private CloudBlobContainer BlobContainer { get; set; }

		/// <summary>
		/// Logs a user in and then returns True if 
		/// the login was successful
		/// </summary>
		/// <returns>Boolean</returns>
		private bool HasLoggedIn(string username, string password)
		{
			try
			{
				var user = _reddit.LogIn(username, password);
				Console.WriteLine("User logged in");
				return true;
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return false;
			}
		}

		private void AddIdToList(string commentId)
		{
			if (!_newCommentIds.Contains(commentId))
			{
				_newCommentIds.Add(commentId);
			}
		}

		private void ReadIdsFromFile()
		{
			try
			{
				var blob = BlobContainer.GetBlockBlobReference("ids.txt");
				var options = new BlobRequestOptions()
				{
					ServerTimeout = TimeSpan.FromMinutes(10)
				};

				var allIds = "";
				using (var memoryStream = new MemoryStream())
				{
					blob.DownloadToStream(memoryStream);
					allIds = System.Text.Encoding.UTF8.GetString(memoryStream.ToArray());
				}

				_commentIds = allIds.Split(' ').ToList();
			}
			catch(Exception e)
			{
				Console.WriteLine(e);
			}
		}

		private void WriteIdsToFile()
		{
			var blob = BlobContainer.GetBlockBlobReference("ids.txt");
			var options = new BlobRequestOptions()
			{
				ServerTimeout = TimeSpan.FromMinutes(10)
			};

			var textToWrite = "";
			foreach (var commentId in _newCommentIds)
			{
				textToWrite += " " + commentId;
			}

			using (var stream = new MemoryStream(Encoding.Default.GetBytes(textToWrite), false))
			{
				blob.UploadFromStream(stream, null, options);
			}
		}

		/// <summary>
		/// Waits until a certain sentence is posted
		/// and then will reply with a message
		/// </summary>
		public void ListenForPrompt()
		{
			var cloudAccount = CloudStorageAccount.Parse(AuthConfig.StorageConnectionString);
			var blobClient = cloudAccount.CreateCloudBlobClient();
			const string containerName = "ids";
			BlobContainer = blobClient.GetContainerReference(containerName);
			BlobContainer.CreateIfNotExists();

			ReadIdsFromFile();

			if (!HasLoggedIn(AuthConfig.Username, AuthConfig.Password))
			{
				return;
			}

			var linkParser = new Regex(@"(http|ftp|https)://([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-](.mp4))?", RegexOptions.Compiled | RegexOptions.IgnoreCase);


			var user = _reddit.GetUser("MLBVideoConverterBot");
			var index = 0;
			foreach (var comment in user.Comments.Take(25))
			{
				if (!_commentIds.Contains(comment.Id))
				{
					var commentBody = comment.Body;

					if (linkParser.IsMatch(commentBody))
					{
						var link = linkParser.Match(commentBody).Value;
						var pieces = link.Split('_');
						var contentId = pieces[pieces.Length - 2];

						var x = contentId[contentId.Length - 3];
						var y = contentId[contentId.Length - 2];
						var z = contentId[contentId.Length - 1];

						var url = string.Format("http://mlb.com/gen/multimedia/detail/{0}/{1}/{2}/{3}.xml", x, y, z, contentId);

						var xmlLoader = new XmlLoader();
						var highlight = xmlLoader.GetXml<Highlight>(url);

						if (highlight != null)
						{
							var gamePkKeyword = highlight.Keywords.FirstOrDefault(a => a.Type == "game_pk");

							var baseDirectory = highlight.GetGameDetailDirectory;

							if (gamePkKeyword != null && baseDirectory != null)
							{
								var gameDetailCreator = new GameDetailCreator(baseDirectory, true);
								var gameSummary = gameDetailCreator.GetGameSummary();
								var allHighlights = gameDetailCreator.GetHighlights();

								if (gameSummary != null)
								{
									var gamePk = gamePkKeyword.Value;
									var date = DateTime.Parse(highlight.Date, CultureInfo.InvariantCulture);
									var dateString = date.ToString("yyyyMMdd");

									var baseballTheaterUrl = string.Format("http://baseball.theater/game/{0}/{1}", dateString, gamePk);

									var videoCount = allHighlights != null && allHighlights.Highlights != null
										? allHighlights.Highlights.Length.ToString(CultureInfo.InvariantCulture)
										: null;

									var redditFormatLink = string.Format(
										"|More from this game|\r\n :--|:--:|--:\r\n [**{0} @ {1}, {2}**]({3})| {4}| \r\n\r\n ^^I ^^am ^^a ^^[bot](http://reddit.com/r/BaseballTheaterBot)",
										gameSummary.AwayTeamName,
										gameSummary.HomeTeamName,
										date.ToString("MM/dd/yyyy"),
										baseballTheaterUrl,
										videoCount != null ? videoCount + "videos" : ""
										);

									try
									{
										comment.Reply(redditFormatLink);
										AddIdToList(comment.Id);
									}
									catch (RateLimitException e)
									{
										Console.WriteLine("Rate limit exceeded, waiting for " + (int)e.TimeToReset.TotalMilliseconds + " milliseconds");
										Thread.Sleep((int)e.TimeToReset.TotalMilliseconds);
									}

									Console.WriteLine(baseballTheaterUrl);
								}
							}
							else
							{
								Console.WriteLine("No game available for id " + contentId);
								AddIdToList(comment.Id);
							}
						}
						else
						{
							Console.WriteLine("Highlight null for id " + contentId);
							AddIdToList(comment.Id);
						}
					}

					index++;
				}
				else
				{
					Console.WriteLine("Id already in file: " + comment.Id);
				}
			}

			WriteIdsToFile();
		}
	}
}