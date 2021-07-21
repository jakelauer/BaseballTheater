import moment = require("moment");
import {MediaItem} from "../baseball-theater-engine/contract";
import {MlbDataServer} from "../baseball-theater-engine";
import AWS from "aws-sdk";
import path from "path";
import fs from "fs";

export interface PopulatorArgs
{
	dateString?: string;
	loopDates?: boolean;
}

class PopulatorInternal
{
	private date: moment.Moment;
	public static Instance = new PopulatorInternal();
	private awsAccess: string;
	private awsSecret: string;

	public initialize(args: PopulatorArgs)
	{
		const keysFile = fs.readFileSync(path.resolve(process.cwd(), "./server/config/keys.json"), "utf8");
		const keys = JSON.parse(keysFile)[0];
		this.awsAccess = keys.s3.AWS_ACCESS_KEY;
		this.awsSecret = keys.s3.AWS_SECRET_ACCESS_KEY;

		AWS.config.update({
			region: 'us-west-2',
			accessKeyId: this.awsAccess,
			secretAccessKey: this.awsSecret
		});

		this.date = args.dateString
			? moment(args.dateString, "YYYYMMDD")
			: moment().add(-5, "days");

		this.loadHighlights()
			.then(() => console.log("Done loading highlights"));
	}

	private async loadHighlights()
	{
		const today = moment();
		let lastDay = this.date;

		console.log("===start loop===")
		while (lastDay.isBefore(today))
		{
			const highlights = await this.loadHighlightsForDate(lastDay);
			const dateString = lastDay.format("YYYYMMDD");
			console.log(dateString);

			if (highlights.length)
			{
				this.writeToDynamo(highlights);
				// const jsonResult = JSON.stringify(highlights);
				//this.writeToS3(`${dateString}.json`, jsonResult);
			}
			lastDay = lastDay.add(1, "day");
		}
		console.log("===end loop===");
	}

	private writeToDynamo(highlights: IHighlightSearchItem[])
	{
		const now = Date.now();
		const docClient = new AWS.DynamoDB.DocumentClient();
		const table = "bbt-highlights";

		highlights.forEach(h =>
		{
			const params = {
				TableName: table,
				Item: {
					game_pk: h.game_pk,
					...h.highlight,
					writeDate: now,
					key: `${h.game_pk}.${h.highlight.id}`
				}
			};

			// Call DynamoDB to add the item to the table
			docClient.put(params, function (err, data)
			{
				if (err)
				{
					console.error(err);
				}
				else
				{
					console.log("Stored " + h.highlight.id);
				}
			});
		});
	}

	private async loadHighlightsForDate(date: moment.Moment)
	{
		const allHighlights: IHighlightSearchItem[] = [];

		const MLB = new MlbDataServer();
		const data = await MLB.getScoreboardNode(date);

		let promises: Promise<any>[] = [];
		data.dates.forEach(date =>
		{
			date.games.forEach(game =>
			{
				promises.push(this.loadHighlightsForGame(MLB, game.gamePk).then(highlights =>
				{
					allHighlights.push(...highlights)
				}));
			});
		});

		await Promise.all(promises);

		return allHighlights;
	}

	private async loadHighlightsForGame(MLB: MlbDataServer, game_pk: string)
	{
		const data = await MLB.getGameMediaNode(game_pk);

		let highlights: IHighlightSearchItem[] = [];
		const hasHighlights = !!(data.highlights && data.highlights.highlights && data.highlights.highlights.items);
		console.log(`hasHighlights: ${hasHighlights}`)
		if (!hasHighlights)
		{
			return highlights;
		}
		if (data.highlights && data.highlights.highlights && data.highlights.highlights.items)
		{
			console.log(data.highlights.highlights.items.length);
			highlights = data.highlights.highlights.items.map(highlight =>
			{
				if (highlight && highlight.image && highlight.image.cuts)
				{
					const images = highlight.image.cuts;

					const matchingCut = images.find(a => a.aspectRatio === "16:9" && a.width < 1000 && a.width > 500)
						|| images.find(a => a.aspectRatio === "16:9")
						|| images[0];

					highlight.image.cuts = [matchingCut];

					const final = {
						highlight,
						game_pk
					};

					//console.log(final);

					return final;
				}
			}).filter(a => a !== undefined);
		}

		return highlights;
	}
}

interface IHighlightSearchItem
{
	highlight: MediaItem,
	game_pk: string
}

export const Populator = PopulatorInternal.Instance;