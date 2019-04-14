import Snoowrap = require("snoowrap");

(require('dotenv') as any).config();

export class RedditAccess
{
	public static Instance = new RedditAccess();

	private snoo: Snoowrap;

	public get Snoo()
	{
		return this.snoo;
	}

	constructor()
	{
	}

	public initialize()
	{
		this.snoo = new Snoowrap({
			userAgent: 'baseball-theater-bot-node',
			clientId: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			username: process.env.REDDIT_USER,
			password: process.env.REDDIT_PASS
		});
	}

	public static detabify(post: string)
	{
		return post.replace(/\t/g, "");
	}
}