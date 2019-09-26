import {RegisterPlaybackEndpoints} from "./Playback/endpoints";
import express from "express";
import * as path from "path";
import {RegisterLocalEndpoints} from "./Local/endpoints";
import compression from "compression";
import cookieParser from "cookie-parser";

// Create the app
const app = express();
const port = process.env.PORT || 5000;
const clientFolder = path.join(process.cwd(), 'client');

// Set up basic settings
app.use(express.static(clientFolder));
app.use(compression());
app.use(cookieParser());

// Register endpoints
RegisterPlaybackEndpoints(app);
RegisterLocalEndpoints(app, clientFolder);

// Start the server
const server = app.listen(port, () => console.log(`Listening on port ${port}`));
server.setTimeout(10000);