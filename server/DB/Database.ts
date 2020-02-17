import {MongoClient} from "mongodb";

class _Database
{
	public static Instance = new _Database();
	private _client: MongoClient;

	constructor()
	{
		this.initialize();
	}

	private get client()
	{
		if (!this._client)
		{
			throw new Error("Mongo failed to connect");
		}

		return this._client;
	}

	public initialize()
	{
		const url = "mongodb://localhost:27017";
		MongoClient.connect(url, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		}, (err, client) =>
		{
			if (err)
			{
				console.error(err);
				return
			}

			this._client = client;
		});
	}

	public get db()
	{
		return this.client.db("bbt");
	}

	public get users()
	{
		return this.db.collection("patrons");
	}
}

export const Database = _Database.Instance;