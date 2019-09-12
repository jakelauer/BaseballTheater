import {PlaybackEndpointMap} from "./Playback/endpoints";
import express from "express";
import * as path from "path";
import {NextFunction, Request, Response} from "express-serve-static-core";
import {Utils} from "./utils";
import {LocalEndpointMap} from "./Local/endpoints";
import {MlbDataServer} from "baseball-theater-engine/dist";

export type ExpressEndpointMap = { [key: string]: (req: Request, res: Response, next: NextFunction) => void; }

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'client/build')));

// console.log that your server is up and running
const server = app.listen(port, () => console.log(`Listening on port ${port}`));
server.setTimeout(10000);

export const MLB = new MlbDataServer();

const allEndpoints = {
	...LocalEndpointMap,
	...PlaybackEndpointMap
};

Object.keys(allEndpoints).map(endpointPath =>
{
	const callback = allEndpoints[endpointPath];

	app.get(endpointPath, (req: Request, res: Response, next: NextFunction) =>
	{
		try
		{
			const valid = Utils.validateApiKey(req);
			if (!valid)
			{
				throw new Error("API Key not valid");
			}
			callback(req, res, next);
		}
		catch (e)
		{
			res.status(500).json({error: e.toString()});
		}
	});
});