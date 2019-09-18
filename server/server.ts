import {RegisterPlaybackEndpoints} from "./Playback/endpoints";
import express from "express";
import * as path from "path";
import {NextFunction, Request, Response} from "express-serve-static-core";
import {RegisterLocalEndpoints} from "./Local/endpoints";
import compression from "compression";

export type ExpressCallback = (req: Request, res: Response, next: NextFunction) => void;
export type ExpressEndpointMap = { [key: string]: ExpressCallback; }

const app = express();
const port = process.env.PORT || 5000;

const clientFolder = path.join(process.cwd(), 'client');
app.use(express.static(clientFolder));
app.use(compression());

RegisterLocalEndpoints(app);
RegisterPlaybackEndpoints(app);

app.get("*", (req: Request, res: Response, next: NextFunction) =>
{
	res.sendFile("index.html", {root: clientFolder});
});

// console.log that your server is up and running
const server = app.listen(port, () => console.log(`Listening on port ${port}`));
server.setTimeout(10000);