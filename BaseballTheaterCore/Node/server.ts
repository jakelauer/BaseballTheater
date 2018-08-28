import * as http from "http";
import {GameChecker} from "./GameChecker";
import {Simulate} from "react-dom/test-utils";
import moment = require("moment");
import {Utility} from "@Utility/index";
import {CustomStorage} from "./CustomStorage";

const snoowrap: any = require("snoowrap");
(require('dotenv') as any).config();

(process.env as any)['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Hello World!\n');
});

const r = new snoowrap({
	userAgent: 'baseball-theater-bot-node',
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	username: process.env.REDDIT_USER,
	password: process.env.REDDIT_PASS
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});

GameChecker.Instance.addDetailCheck((game) => {
	if (game && game.liveData && game.liveData.linescore
		&& game.liveData.linescore.innings
		&& game.liveData.linescore.teams
		&& game.liveData.linescore.teams.home
		&& game.liveData.linescore.teams.away
		&& game.liveData.boxscore
		&& game.liveData.boxscore.teams
		&& game.liveData.boxscore.teams.home
		&& game.liveData.boxscore.teams.away)
	{
		const enoughInnings = game.liveData.linescore.innings.length > 1;
		const awayHits = game.liveData.linescore.teams.away.hits;
		const homeHits = game.liveData.linescore.teams.home.hits;
		const awayPitchers = game.liveData.boxscore.teams.away.pitchers.length;
		const homePitchers = game.liveData.boxscore.teams.away.pitchers.length;
		const isNoHitter = enoughInnings && (
			(awayHits === 0 && awayPitchers === 1)
			|| (homeHits === 0 && homePitchers === 1)
		);

		if (isNoHitter)
		{
			const posted = CustomStorage.Instance.Store.getItem(game.gamePk.toString());
			if (posted)
			{
				return;
			}

			try
			{
				const isAway = awayHits === 0;
				const pitcher = isAway
					? game.liveData.boxscore.teams.away.pitchers[0]
					: game.liveData.boxscore.teams.home.pitchers[0];

				const againstTeam = isAway
					? game.gameData.teams.home.name
					: game.gameData.teams.away.name;

				if (pitcher)
				{
					const pitcherData = Utility.Mlb.getStatsForPlayerId(pitcher, game);

					if (pitcherData)
					{
						const today = moment().add(-8, "hours");
						const dayString = today.format("YYYYMMDD");

						r.getSubreddit("BaseballTheaterBot")
							.submitSelfpost({
								title: `No Hitter Alert: ${pitcherData.person.fullName}`,
								text: `${pitcherData.person.fullName} is pitching a no-hitter against the ${againstTeam}. \r\n\r\nView details at:\r\n[MLB.com](https://www.mlb.com/gameday/${game.gamePk})\r\n[Baseball.Theater](https://baseball.theater/game/${dayString}/${game.gamePk})`
							});

						CustomStorage.Instance.Store.setItem(game.gamePk.toString(), "true");
					}
				}
			}
			catch (e)
			{
				console.error(e);
			}
		}

	}
});

GameChecker.Instance.start();

