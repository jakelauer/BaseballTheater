import * as http from "http";
import {GameChecker} from "./GameChecker";
const snoowrap = require("snoowrap");

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Hello World!\n');
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});

GameChecker.Instance.addDetailCheck((game) => {
	let isNoHitter = false;
	
	if (game && game.liveData && game.liveData.linescore
		&& game.liveData.linescore.innings
		&& game.liveData.linescore.teams
		&& game.liveData.linescore.teams.home
		&& game.liveData.linescore.teams.away)
	{
		const enoughInnings = game.liveData.linescore.innings.length > 5;
		const awayHits = game.liveData.linescore.teams.away.hits;
		const homeHits = game.liveData.linescore.teams.home.hits;
		isNoHitter = enoughInnings && (awayHits === 0 || homeHits === 0);
	}
	
	console.log(isNoHitter);
});

GameChecker.Instance.start();

const r = new snoowrap({
	userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36",
	clientId: "2KWBBmpi0zUuPA",
	clientSecret: "5vmWP7hgZ0A6Y19GXcJbhhC8waE",
	refreshToken: "rz__zh1VqhC4DKWZEq0yK2uYPFQ"
});

r.getSubreddit("BaseballTheaterBot")
	.submitSelfPost({
		title: "Test",
		text: "Test"
	});