using MlbDataServer;
using MlbDataServer.DataStructures;
using RedditBot.Config;
using RedditSharp;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;

namespace RedditBot
{
	class RedditAccess
	{
		private readonly Reddit _reddit = new Reddit();
		private readonly List<string> _commentIds = new List<string>();
		private const string CommentIdFilePath = "ids.txt";

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
			if (!_commentIds.Contains(commentId))
			{
				_commentIds.Add(commentId);
			}
		}

		private void WriteIdsToFile()
		{
			using (var file = new StreamWriter(CommentIdFilePath))
			{
				foreach (var commentId in _commentIds)
				{
					file.Write(" {0}", commentId);
				}
			}
		}

		/// <summary>
		/// Waits until a certain sentence is posted
		/// and then will reply with a message
		/// </summary>
		public void ListenForPrompt()
		{
			if (!HasLoggedIn(AuthConfig.Username, AuthConfig.Password))
			{
				return;
			}

			var linkParser = new Regex(@"(http|ftp|https)://([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-](.mp4))?", RegexOptions.Compiled | RegexOptions.IgnoreCase);


			var user = _reddit.GetUser("MLBVideoConverterBot");
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

							if (gamePkKeyword != null)
							{
								var gamePk = gamePkKeyword.Value;
								var date = DateTime.Parse(highlight.Date, CultureInfo.InvariantCulture);
								var dateString = date.ToString("yyyyMMdd");

								var baseballTheaterUrl = string.Format("http://baseball.theater/game/{0}/{1}", dateString, gamePk);
								Console.WriteLine(baseballTheaterUrl);
							}
						}
						else
						{
							Console.WriteLine("Highlight null for id " + contentId);
						}
					}

					AddIdToList(comment.Id);
					//WriteIdsToFile();
				}
			}
		}
	}
}