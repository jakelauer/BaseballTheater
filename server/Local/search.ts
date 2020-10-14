import fs from "fs";
import path from "path";
import {IHighlightSearchItem} from "../../baseball-theater-engine/contract";
import AWS, {S3} from "aws-sdk";
// @ts-ignore
import createAwsElasticsearchConnector from "aws-elasticsearch-connector";
import {Client} from "@elastic/elasticsearch";
import * as RequestParams from "@elastic/elasticsearch/api/requestParams";

interface ISearchable
{
	index: number;
	searchText: string;
	game_pk: number;
}

class SearchInternal
{
	public static Instance = new SearchInternal();
	private allHighlights: IHighlightSearchItem[] = [];
	private allSearchable: ISearchable[] = [];
	private loadedPlaybackIds: string[] = [];
	private awsAccess: string;
	private awsSecret: string;
	private s3: S3;

	public initialize()
	{
		const keysFile = fs.readFileSync(path.resolve(process.cwd(), "./server/config/keys.json"), "utf8");
		const keys = JSON.parse(keysFile)[0];
		this.awsAccess = keys.aws_es.AWS_ACCESS_KEY;
		this.awsSecret = keys.aws_es.AWS_SECRET_ACCESS_KEY;

		AWS.config.update({
			region: 'us-west-2',
			accessKeyId: this.awsAccess,
			secretAccessKey: this.awsSecret
		});

		this.s3 = new AWS.S3(AWS.config);

		//this.loadIntoMemory();
	}

	private loadTimer = () =>
	{
		setTimeout(() => this.loadIntoMemory(), 1000 * 60 * 10);
	};

	private afterAllLoaded(startingCount: number)
	{
		this.allHighlights = this.allHighlights.sort((a, b) =>
		{
			return b.game_pk - a.game_pk;
		});

		this.allSearchable = this.allHighlights.map((h, i) =>
		{
			const keywords = h.highlight.keywordsAll.map(k => k.value + " " + k.displayName);
			const searchText = `${h.highlight?.headline ?? ""} ${h.highlight?.blurb ?? ""} ${h.highlight?.kicker ?? ""} ${h.highlight?.description ?? ""} ${keywords}`
				.replace(/\W/g, '')
				.toUpperCase();

			return {
				game_pk: h.game_pk,
				index: i,
				searchText
			};
		});

		const finalCount = this.allHighlights.length;

		console.log(`Loaded ${finalCount - startingCount} new highlights.`);
	}

	private async getFilesRecursivelySub(param: S3.Types.ListObjectsV2Request): Promise<S3.Object[]>
	{
		// Call the function to get list of items from S3.
		let result = await this.s3.listObjectsV2(param).promise();

		if (!result.IsTruncated)
		{
			// Recursive terminating condition.
			return result.Contents;
		}
		else
		{
			// Recurse it if results are truncated.
			param.ContinuationToken = result.NextContinuationToken;
			return result.Contents.concat(await this.getFilesRecursivelySub(param));
		}
	}

	private async loadIntoMemory()
	{
		const Bucket = "baseball-theater-highlights";

		console.log("Loading highights at " + Date.now());

		const startingCount = this.allHighlights.length;

		const objectList = await this.getFilesRecursivelySub({
			Bucket
		});

		let totalLoaded = 0;
		const filesLength = objectList.length;

		console.log(`Loading ${objectList.length} objects from S3...`);
		objectList.forEach(o =>
		{
			console.log(`Loading ${o.Key}...`);
			this.s3.getObject({
				Bucket,
				Key: o.Key
			}, (err, data) =>
			{
				totalLoaded++;

				if (err)
				{
					console.error(err);
				}
				else
				{
					const fileJson = data.Body.toString();

					const fileHighlights = JSON.parse(fileJson.toString()) as IHighlightSearchItem[];

					console.log(`Found ${fileHighlights.length} Highlights for ${o.Key}. Loaded ${totalLoaded} of ${objectList.length}`);

					const newHighlights = fileHighlights.filter(nh => this.loadedPlaybackIds.indexOf(nh.highlight.mediaPlaybackId) === -1);

					this.allHighlights.push(...newHighlights);
					this.loadedPlaybackIds.push(...newHighlights.map(h => h.highlight.mediaPlaybackId));
				}

				if (totalLoaded === filesLength)
				{
					this.afterAllLoaded(startingCount);
				}
			});
		});

		this.loadTimer();
	}

	public async doSearchFromES(query: { text: string, gameIds?: number[] }, page = 0): Promise<IHighlightSearchItem[]>
	{
		let result: IHighlightSearchItem[] = [];

		try
		{
			console.log(this.awsAccess, this.awsSecret);

			AWS.config.update({
				region: 'us-west-2',
				accessKeyId: this.awsAccess,
				secretAccessKey: this.awsSecret
			});

			const client = new Client({
				...createAwsElasticsearchConnector(AWS.config),
				node: "https://search-baseball-theater-p3m7bf36psaxxxpjv44lfacmfe.us-west-2.es.amazonaws.com"
			});

			const wildcardQuery = `${query.text}`

			const per = 20;

			let must: any[] = [
				{
					"multi_match": {
						"query": wildcardQuery,
						"fields": ["blurb", "title^2", "description", "*"]
					}
				}
			];

			if (query.gameIds)
			{
				must.push({
					"terms": {
						"game_pk": query.gameIds,
					}
				});
			}

			const params: RequestParams.Search = {
				index: "highlights-index",
				from: page * per,
				size: per,
				body: {
					sort: [{"game_pk": {"order": "desc"}}],
					query: {
						"bool": {
							"must": must
						}
					},
				}
			};

			const data = await client.search(params)
			const hits = data?.body?.hits?.hits as any[] ?? [];
			result = hits.map(h =>
			{
				const {
					game_pk,
					...rest
				} = h._source;

				const highlight: IHighlightSearchItem = {
					game_pk,
					highlight: rest
				};

				return highlight;
			}) as IHighlightSearchItem[];
		}
		catch (e)
		{
			console.error(e);
		}

		return result;
	}
}

export const Search = SearchInternal.Instance;