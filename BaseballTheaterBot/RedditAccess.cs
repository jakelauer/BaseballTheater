using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using Microsoft.WindowsAzure.Storage.Blob;
using MlbDataServer;
using MlbDataServer.DataFetch;
using MlbDataServer.DataStructures;
using RedditBot.Config;
using RedditSharp;
using RedditSharp.Things;

namespace RedditBot
{
	class RedditAccess
	{
		private readonly Reddit _reddit = new Reddit();
		private List<string> _thingIds = new List<string>();
		private const string CommentIdFilePath = @"C:\baseballtheater.txt";
		private const int CommentsToTest = 10;
		private const int CommentsToSave = CommentsToTest * 5;

		private Regex CommentVideoRegex { get; set; }
		private Regex GamePkRegex { get; set; }

		private CloudBlobContainer BlobContainer { get; set; }

		public RedditAccess()
		{
			CommentVideoRegex = new Regex(@"(http|ftp|https)://([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-](.mp4))?", RegexOptions.Compiled | RegexOptions.IgnoreCase);

			GamePkRegex = new Regex(@".*gameid=([0-9]+)", RegexOptions.Compiled | RegexOptions.IgnoreCase);
		}

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
				TimeLog("User logged in");
				return true;
			}
			catch (Exception ex)
			{
				TimeLog(ex.Message);
				return false;
			}
		}

		private void AddIdToList(string commentId)
		{
			_thingIds.Add(commentId);
		}

		private void ReadIdsFromFile()
		{
			try
			{
				var allIds = "";
				using (var file = new StreamReader(CommentIdFilePath))
				{
					allIds = file.ReadToEnd();
				}
				_thingIds = allIds.Split(' ').ToList();
			}
			catch (Exception e)
			{
				TimeLog(e);
			}
		}

		private void WriteIdsToFile(IEnumerable<string> ids)
		{
			try
			{
				var textToWrite = "";
				foreach (var commentId in ids)
				{
					textToWrite += " " + commentId;
				}

				using (var file = new StreamWriter(CommentIdFilePath))
				{
					file.Write(textToWrite);
				}
			}
			catch (Exception e)
			{
				TimeLog(e);
			}
		}

		private void WriteIdToFile(string id)
		{

			TruncateCommentsFile();
		}

		private void TruncateCommentsFile()
		{
			var commentsToLeave = _thingIds.Skip(_thingIds.Count - CommentsToSave).Take(CommentsToSave);
			WriteIdsToFile(commentsToLeave);
		}

		/// <summary>
		/// Waits until a certain sentence is posted
		/// and then will reply with a message
		/// </summary>
		public void ListenForPrompt()
		{
			TimeLog("RedditBot Started");
			ReadIdsFromFile();

			if (!HasLoggedIn(AuthConfig.Username, AuthConfig.Password))
			{
				return;
			}

			try
			{
				var user = _reddit.GetUser("MLBVideoConverterBot");
				TimeLog("Getting MLBVideoConverterBot Comments");
				var things = user.Comments.Take(CommentsToTest).OrderByDescending(a => a.Created);
				this.ProcessThings(things);
			}
			catch (Exception e)
			{
				TimeLog(e);
			}

			try
			{
				TimeLog("Getting direct video link posts");
				var domain = _reddit.GetDomain("mediadownloads.mlb.com");
				var posts = domain.Posts.Take(CommentsToTest).OrderByDescending(a => a.Created);
				this.ProcessThings(posts);
			}
			catch (Exception e)
			{
				TimeLog(e);
			}

			TimeLog("All done! Closing in 10 seconds.");
			Thread.Sleep(10000);
		}

		private void DoReply(Thing replyToThis, string gamePk, Highlight highlight, GameSummary gameSummary)
		{
			var replyToThisComment = replyToThis as Comment;
			var replyToThisPost = replyToThis as Post;

			var parentPost = replyToThisPost;

			if (replyToThisComment != null)
			{
				if (replyToThisComment.Author.ToLower() == "mlbvideoconverterbot")
				{
					var parent = replyToThisComment.GetParent();
					if (parent != null)
					{
						replyToThis = parent;

						replyToThisComment = replyToThis as Comment;
						replyToThisPost = replyToThis as Post;
					}
				}
			}

			if (_thingIds.Contains(replyToThis.Id))
			{
				TimeLog("Id already in file: " + replyToThis.Id);
				return;
			}

			TimeLog("Getting parent post, checking for existing comments in thread");

			parentPost = replyToThisComment != null
				? this._reddit.GetPost(replyToThisComment.Subreddit, replyToThisComment.LinkId)
				: replyToThisPost;

			if (parentPost != null)
			{
				var existingComments = parentPost.Comments.Where(a => a.Author == "BaseballTheaterBot");
				if (existingComments.Any(a => GamePkRegex.Match(a.Body).Value == gamePk))
				{
					TimeLog(string.Format("Already posted game {0} in this thread {1}", gamePk, parentPost.Id));
					return;
				}
			}

			TimeLog(string.Format("Thing ID {0} found and is not yet replied to", replyToThis.Id));

			var date = DateTimeOffset.Parse(highlight.Date, CultureInfo.InvariantCulture);
			var dateString = date.ToString("yyyyMMdd");

			var baseballTheaterUrl = string.Format("http://baseball.theater/game/{0}/{1}", dateString, gamePk);

			var redditFormatLink = string.Format(
				"More highlights from this game at baseball.theater: \r\n\r\n[**{0} @ {1}, {2}**]({3})\r\n\r\n---\r\n\r\n[More info and feedback](http://np.reddit.com/r/BaseballTheaterBot)\r\n\r\n^^^^^^^^^^^^^^^^^^^^^^^^^^^gamepk={4}",
				gameSummary.AwayTeamName,
				gameSummary.HomeTeamName,
				date.ToString("MM/dd/yyyy"),
				baseballTheaterUrl,
				gameSummary.GamePk
				);

			try
			{
				var succeeded = false;
				if (replyToThisComment != null)
				{
					replyToThisComment.Reply(redditFormatLink);
					succeeded = true;
				}
				else if (replyToThisPost != null)
				{
					replyToThisPost.Comment(redditFormatLink);
					succeeded = true;
				}

				if (succeeded)
				{
					AddIdToList(replyToThis.Id);
					TimeLog("Comment published.");
					WriteIdToFile(replyToThis.Id);

					TimeLog(baseballTheaterUrl);
				}
			}
			catch (RateLimitException e)
			{
				var ms = (int) e.TimeToReset.TotalMilliseconds;
				var remaining = (int) e.TimeToReset.TotalMilliseconds;
				const int loopMs = 200;

				for (var i = 0; i < ms/loopMs; i++)
				{
					TimeLog("Rate limit exceeded, waiting for " + remaining + " milliseconds", true);
					Thread.Sleep(loopMs);

					remaining -= loopMs;
				}
			}
			catch (Exception e)
			{
				TimeLog(e);
			}
		}

		private void logGameNotFound(string contentId, Thing comment, Exception e = null)
		{
			TimeLog("No game available for ID " + contentId);
			if (e != null)
			{
				TimeLog(e);
			}
			AddIdToList(comment.Id);
		}

		private string GetContentIdFromVideoUrl(string videoUrl)
		{
			var contentId = "";
			if (videoUrl.IndexOf("mlbtv_", StringComparison.Ordinal) > -1)
			{
				var pieces = videoUrl.Split('_');
				contentId = pieces[pieces.Length - 2];
			}
			else
			{
				var pieces = videoUrl.Split('/');
				contentId = pieces[pieces.Length - 3];
			}

			return contentId;
		}

		private string GetMlbXmlFileFromVideoUrl(string contentId)
		{
			var x = contentId[contentId.Length - 3];
			var y = contentId[contentId.Length - 2];
			var z = contentId[contentId.Length - 1];

			var url = string.Format("http://mlb.com/gen/multimedia/detail/{0}/{1}/{2}/{3}.xml", x, y, z, contentId);
			return url;
		}

		private static void TimeLog(string message, bool isUpdate = false)
		{
			var dateString = DateTime.UtcNow.ToString("hh:mm:ss:fff tt");
			var cr = isUpdate ? "\r" : "";
			var crEnd = isUpdate ? "" : "\r\n";

			var finalString = string.Format("{0}{1} | {2}{3}", 
				cr, 
				dateString, 
				message,
				crEnd);

			Console.Write(finalString);
		}

		private static void TimeLog<T>(T thing, bool isUpdate = false)
		{
			var tString = thing.ToString();
			TimeLog(tString, isUpdate);
		}

		private void ProcessThings(IEnumerable<Thing> things)
		{
			foreach (var thing in things)
			{
				var replyToThis = thing;
				var comment = thing as Comment;
				var post = thing as Post;
				var contentId = "";

				if (comment != null)
				{
					var commentBody = comment.Body;
					if (!CommentVideoRegex.IsMatch(commentBody))
					{
						TimeLog(string.Format("Comment ID {0}: No video found in string", comment.Id));
						continue;
					}

					var link = CommentVideoRegex.Match(commentBody).Value;
					contentId = GetContentIdFromVideoUrl(link);
				}

				if (post != null)
				{
					contentId = GetContentIdFromVideoUrl(post.Url.ToString());
				}
				
				var url = GetMlbXmlFileFromVideoUrl(contentId);


				Highlight highlight = null;
				try
				{
					var xmlLoader = new XmlLoader();
					highlight = xmlLoader.GetXml<Highlight>(url);
				}
				catch (Exception e)
				{
					this.logGameNotFound(contentId, thing, e);
				}

				if (highlight != null)
				{
					var gamePkKeyword = highlight.Keywords.FirstOrDefault(a => a.Type == "game_pk");
					var baseDirectory = highlight.GetGameDetailDirectory;

					if (gamePkKeyword != null && baseDirectory != null)
					{
						var gamePk = gamePkKeyword.Value;
						var gameDetailCreator = new GameDetailCreator(baseDirectory, true);
						var gameSummary = gameDetailCreator.GetGameSummary();
						var allHighlights = gameDetailCreator.GetHighlights();

						if (gameSummary != null &&
							allHighlights != null &&
							allHighlights.Highlights != null &&
							allHighlights.Highlights.Length > 0)
						{

							this.DoReply(replyToThis, gamePk, highlight, gameSummary);
						}
					}
					else
					{
						this.logGameNotFound(contentId, thing);
					}
				}
				else
				{
					TimeLog("Highlight null for id " + contentId);
					AddIdToList(thing.Id);
				}
			}
		}
	}
}