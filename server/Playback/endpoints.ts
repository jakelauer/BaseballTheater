import {ExpressEndpointMap} from "../server";
import {MlbDataServer, VideoSearchWithMetadata} from "../../baseball-theater-engine";
import {Express} from "express";
import {PlaybackUtils} from "./PlaybackUtils";
import moment from "moment";
import {CompilationTypes} from "../../baseball-theater-engine/contract/PlaybackContracts";

export const PlaybackEndpointMap: ExpressEndpointMap = {
	"/video/tag-search/:tag/:page": (req, res) =>
	{
		const MLB = new MlbDataServer();
		MLB.VideoTagSearch(req.params.tag, parseInt(req.params.page))
			.then((data: VideoSearchWithMetadata[]) =>
			{
				res.send(data);
			});

	}
};

export const RegisterPlaybackEndpoints = (app: Express) =>
{
	/**
	 * @swagger
	 *
	 * /compilations
	 *  get:
	 *      description: Returns videos that contain multiple plays following a theme
	 *      parameters:
	 *        - name: type
	 *          description: The type of compilation
	 *          type: CompilationTypes
	 *        - name: sinceDays
	 *          description: The number of days ago to search (max 7)
	 *          type: number
	 */
	app.get("/api/compilations", (req, res) =>
	{
		PlaybackUtils.requireApiKey(req, res);

		const MLB = new MlbDataServer();

		const type = req.query.type as CompilationTypes;
		const daysParam = req.query.page || 1;
		const days = Math.min(7, parseInt(daysParam, 10));

		// This is the oldest time we'll check for
		const limit = moment().add(days * -1, "days");

		const results: VideoSearchWithMetadata[] = [];

		let hitLimit = false;

		// We'll run this until it stops
		const fetchNextPage = (page = 0): Promise<void> => MLB.VideoTagSearch(type, page)
			.then(data =>
			{
				results.push(...data);

				const oldest = data[data.length - 1];
				const oldestDate = moment(oldest.metadata.date);
				hitLimit = hitLimit || oldestDate.isBefore(limit);
				if (!hitLimit)
				{
					return fetchNextPage(page);
				}
				else
				{
					return Promise.resolve();
				}
			});

		fetchNextPage(0)
			.then(() =>
			{
				res.send(results);
			})
	});
};