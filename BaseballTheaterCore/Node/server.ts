import * as http from "http";
import {NoHitterChecker} from "./Checkers/NoHitterChecker";
import {GameChecker} from "./GameChecker";
import moment = require("moment");
import {Utility} from "@Utility/index";
import {CustomStorage} from "./CustomStorage";
import {RedditAccess} from "./RedditAccess";

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) =>
{
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Hello World!\n');
});

server.listen(port, hostname, () =>
{
	console.log(`Server running at http://${hostname}:${port}/`);
});

RedditAccess.Instance.initialize();

GameChecker.Instance.addDetailCheck((game) => NoHitterChecker.check(game));

GameChecker.Instance.start();

