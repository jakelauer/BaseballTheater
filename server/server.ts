import {RegisterPlaybackEndpoints} from "./Playback/endpoints";
import express from "express";
import * as path from "path";
import {RegisterLocalEndpoints} from "./Local/endpoints";
import compression from "compression";
import cookieParser from "cookie-parser";
import serveStatic from "serve-static";
import {Search} from "./Local/search";

// Create the app
const app = express();
const port = process.env.PORT || 5000;
const clientFolder = path.join(process.cwd(), 'client');

// Set up basic settings
app.use(express.static(clientFolder, {
	cacheControl: true
}));
app.use(compression());
app.use(cookieParser());

app.get("/service-worker.js", (req, res) =>
{
	// Don't cache service worker is a best practice (otherwise clients wont get emergency bug fix)
	res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
	res.set("Content-Type", "application/javascript");
	serveStatic("/service-worker.js");
});

Search.initialize();

// Register endpoints
RegisterPlaybackEndpoints(app);
RegisterLocalEndpoints(app, clientFolder);

// Start the server
const server = app.listen(port, () => console.log(`Listening on port ${port}`));
server.setTimeout(10000);