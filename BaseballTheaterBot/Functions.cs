using Microsoft.Azure.WebJobs;

namespace RedditBot
{
	public class Functions
	{
		public static void HelloWorldFunction(
			[QueueTrigger("inputText")] string inputText)
		{
		}
	}
}
