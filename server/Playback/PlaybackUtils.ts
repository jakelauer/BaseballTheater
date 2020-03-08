import {Utils} from "../utils";
import {Request, Response} from "express";
import moment from "moment";
import {MediaItem} from "baseball-theater-engine";

export class PlaybackUtils
{
	public static apiKeyRequiredEnabled = false;

	public static requireApiKey = (req: Request, res: Response) =>
	{
		const valid = Utils.validateApiKey(req);
		if (!valid && PlaybackUtils.apiKeyRequiredEnabled)
		{
			const error = new Error("API Key not valid");

			res.status(500).json({error: error.toString()})
		}
	};

	public static getPagesUntilTimeLimit<T>(promiseGenerator: (page: number) => Promise<MediaItem[]>, timeLimit: moment.Moment)
	{
		let page = 1;
		const results: MediaItem[] = [];
		let hitLimit = false;

		return new Promise<MediaItem[]>((resolve, reject) =>
		{
			const fetchNextPage = (): Promise<void> => promiseGenerator(page)
				.then(data =>
				{
					results.push(...data);

					if (data.length > 0)
					{
						const oldest = data[data.length - 1];
						const oldestDate = moment(oldest.date);
						hitLimit = hitLimit || oldestDate.isBefore(timeLimit);
						if (!hitLimit)
						{
							page++;

							return fetchNextPage();
						}
					}
					else
					{
						hitLimit = true;
					}

					if (hitLimit)
					{
						return resolve(results);
					}
				})
				.catch(e => reject(e));

			fetchNextPage();
		})
	}

	public static timeLimitFromDayCount(dayString: string)
	{
		const days = Math.min(7, parseInt(dayString, 10));

		// This is the oldest time we'll check for
		return moment().add(days * -1, "days");
	}
}
