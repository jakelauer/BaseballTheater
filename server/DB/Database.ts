import {MongoClient} from "mongodb";
import * as fs from "fs";
import * as path from "path";

class _Database
{
	public static Instance = new _Database();
	private _client: MongoClient;
	private url: string;

	constructor()
	{
		const keysFile = fs.readFileSync(path.resolve(process.cwd(), "./server/config/keys.json"), "utf8");
		const keys = JSON.parse(keysFile)[0];
		this.url = keys.mongo.url;

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
		MongoClient.connect(this.url, {
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