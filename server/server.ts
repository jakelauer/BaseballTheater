import {PlaybackEndpointMap} from "./playback-endpoints";
import express from "express";
import * as path from "path";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'client/build')));

// console.log that your server is up and running
const server = app.listen(port, () => console.log(`Listening on port ${port}`));
server.setTimeout(10000);

// create a GET route
app.get("/express_backend", (req, res) => {
  res.send({ express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT" });
});

const playback = Object.keys(PlaybackEndpointMap).map(endpointPath => {
  const callback = PlaybackEndpointMap[endpointPath];

  app.get(endpointPath, callback);
});