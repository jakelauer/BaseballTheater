import * as http from "http";
import { Populator } from "./Populator";
const args = require('gar')(process.argv.slice(2))

//const hostname = '127.0.0.1';
//const port = 3000;

//const server = http.createServer((req, res) =>
//{
//	res.statusCode = 200;
//	res.setHeader('Content-Type', 'text/plain');
//	res.end('Hello World!\n');
//});

//server.listen(port, hostname, () =>
//{
//	console.log(`Server running at http://${hostname}:${port}/`);
//});

//RedditAccess.Instance.initialize();

//GameChecker.Instance.addDetailCheck((game) => NoHitterChecker.check(game));

//GameChecker.Instance.start();

Populator.initialize(args);