using System;
using Microsoft.Azure.WebJobs;
using System.IO;

namespace RedditBot
{
	public class Functions
	{
		public static void HelloWorldFunction(
			[QueueTrigger("inputText")] string inputText,
			[Blob("helloworld/out.txt")] out string output)
		{
			output = inputText;
		}
	}
}
