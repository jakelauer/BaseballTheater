import {PlaybackEndpointMap} from "./playback-endpoints";
import express from "express";
import * as path from "path";
import {NextFunction, Request, Response} from "express-serve-static-core";
import {Utils} from "./utils";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'client/build')));

// console.log that your server is up and running
const server = app.listen(port, () => console.log(`Listening on port ${port}`));
server.setTimeout(10000);

// create a GET route
app.get("/express_backend", (req, res) =>
{
	res.send({express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT"});
});

Object.keys(PlaybackEndpointMap).map(endpointPath =>
{
	const callback = PlaybackEndpointMap[endpointPath];

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