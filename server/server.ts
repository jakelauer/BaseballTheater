import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import * as path from 'path';
import serveStatic from 'serve-static';

import { Database } from './DB/Database';
import { Auth } from './Local/auth';
import { RegisterLocalEndpoints } from './Local/endpoints';
import { Search } from './Local/search';
import { RegisterPlaybackEndpoints } from './Playback/endpoints';

// Create the app
const app = express();
const port = process.env.PORT || 8000;
const clientFolder = path.join(process.cwd(), 'client');

console.log("clientFolder: " + clientFolder);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(clientFolder, {
		cacheControl: true,
	}));
}

app.use(compression() as any);
app.use(cookieParser() as any);
app.use(bodyParser.json({
	type: ['application/json', 'text/plain']
}) as any);
app.use(bodyParser.urlencoded({extended: true}) as any);


app.get("/service-worker.js", (req, res) =>
{
	// Don't cache service worker is a best practice (otherwise clients wont get emergency bug fix)
	res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
	res.set("Content-Type", "application/javascript");
	serveStatic("/service-worker.js");
});

// Register endpoints
RegisterPlaybackEndpoints(app);
RegisterLocalEndpoints(app, clientFolder);

// Start the server
const server = app.listen(port, () => console.log(`Listening on port ${port}`));
server.setTimeout(10000);

Search.initialize();
Auth.initialize();
Database.initialize();
