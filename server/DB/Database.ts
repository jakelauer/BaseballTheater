import {MongoClient} from "mongodb";
import * as fs from "fs";
import * as path from "path";
import AWS from "aws-sdk";
import {IHighlightSearchItem} from "baseball-theater-engine";

export interface IUser
{
	id: string;
	accessToken: string;
	refresh_token: any;
	refresh_expiry: Date;
	settings: any;
}

class _Database
{
	public static Instance = new _Database();
	private _client: MongoClient;
	private _docClient: AWS.DynamoDB.DocumentClient;
	private _table = "bbt-patrons";
	private url: string;

	constructor()
	{
		const keysFile = fs.readFileSync(path.resolve(process.cwd(), "./server/config/keys.json"), "utf8");
		const keys = JSON.parse(keysFile)[0];
		this.url = keys.mongo.url;

		AWS.config.update({
			region: 'us-west-2',
			accessKeyId: keys.s3.AWS_ACCESS_KEY,
			secretAccessKey: keys.s3.AWS_SECRET_ACCESS_KEY
		});
	}

	private get client()
	{
		if (!this._docClient)
		{
			throw new Error("DynamoDB failed to connect");
		}

		return this._docClient;
	}

	public initialize()
	{
		this._docClient = new AWS.DynamoDB.DocumentClient();
	}

	public async updateUser(id: string, update: Partial<IUser>)
	{
		return new Promise<void>(async (resolve, reject) =>
		{
			const existing = await this.getUser(id)

			const data = {...existing, ...update};

			const params = {
				TableName: this._table,
				Item: {
					id,
					...data
				}
			};

			// Call DynamoDB to add the item to the table
			this.client.put(params, function (err, data)
			{
				if (err)
				{
					console.error(err);
					reject(err);
				}
				else
				{
					console.log("Updated user " + id);
					resolve();
				}
			});
		});
	}

	public getUser(id: string): Promise<IUser>
	{
		return new Promise((resolve, reject) =>
		{
			this._docClient.get({
				TableName: "bbt-patrons",
				Key: {
					id
				}
			}, (err, data: any) =>
			{
				if (err)
				{
					reject(err);
				}
				else
				{
					resolve(data.Item);
				}
			});
		});
	}

	public getHighlightsForGame(game_pk: number): Promise<IHighlightSearchItem[]>
	{
		return new Promise((resolve, reject) =>
		{
			this._docClient.query({
				TableName: "bbt-highlights",
				KeyConditionExpression: "game_pk = :gggggg",
				ExpressionAttributeValues: {
					":gggggg": game_pk
				}

			}, (err, data: any) =>
			{
				if (err)
				{
					reject(err);
				}
				else
				{
					resolve(data.Item);
				}
			});
		});
	}
}

export const Database = _Database.Instance;