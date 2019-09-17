import {PlaybackEndpointMap} from "./Playback/endpoints";
import express from "express";
import * as path from "path";
import {NextFunction, Request, Response} from "express-serve-static-core";
import {Utils} from "./utils";
import {LocalEndpointMap} from "./Local/endpoints";
import compression from "compression";

export type ExpressEndpointMap = { [key: string]: (req: Request, res: Response, next: NextFunction) => void; }

const app = express();
const port = process.env.PORT || 5000;

const clientFolder = path.join(process.cwd(), 'client');
app.use(express.static(clientFolder));
app.use(compression());
console.log(clientFolder);

const apiKeyEndpoints = {
	...PlaybackEndpointMap
};

const allEndpoints = {
	...apiKeyEndpoints,
	...LocalEndpointMap
};

Object.keys(allEndpoints).map(endpointPath =>
{
	const callback = allEndpoints[endpointPath];

	app.get(`/api${endpointPath}`, (req: Request, res: Response, next: NextFunction) =>
	{
		const requiresApiKey = endpointPath in apiKeyEndpoints;

		try
		{
			const valid = !requiresApiKey || Utils.validateApiKey(req);
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

app.get("*", (req: Request, res: Response, next: NextFunction) =>
{
	res.sendFile("index.html", {root: clientFolder});
});

// console.log that your server is up and running
const server = app.listen(port, () => console.log(`Listening on port ${port}`));
server.setTimeout(10000);