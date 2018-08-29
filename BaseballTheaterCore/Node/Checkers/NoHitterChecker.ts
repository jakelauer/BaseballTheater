import {BoxScorePlayer, LiveData} from "@MlbDataServer/Contracts";
import {Utility} from "@Utility/index";
import {CustomStorage} from "../CustomStorage";
import {RedditAccess} from "../RedditAccess";
import moment = require("moment");

export class NoHitterChecker
{
	private static gameIsValid(game: LiveData)
	{
		return game && game.liveData && game.liveData.linescore
			&& game.liveData.linescore.innings
			&& game.liveData.linescore.teams
			&& game.liveData.linescore.teams.home
			&& game.liveData.linescore.teams.away
			&& game.liveData.boxscore
			&& game.liveData.boxscore.teams
			&& game.liveData.boxscore.teams.home
			&& game.liveData.boxscore.teams.away;
	}

	private static isNoHitter(game: LiveData)
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

		return isNoHitter;
	}

	private static generateBoxScore(game: LiveData)
	{
		const awayTotals = game.liveData.linescore.teams.away;
		const homeTotals = game.liveData.linescore.teams.home;
		const innings = game.liveData.linescore.innings;

		const headers = innings.map(inning => inning.num.toString());
		headers.unshift(" ");
		headers.push("R", "H", "E");

		const alignment = innings.map(_ => ":-:");
		alignment.unshift(":--");
		alignment.push(":--", ":--", ":--");

		const away: (string | number)[] = innings.map(inning => inning.away.runs);
		away.unshift(game.gameData.teams.away.name);
		away.push(awayTotals.runs, awayTotals.hits, awayTotals.errors);

		const home: (string | number)[] = innings.map(inning => inning.home.runs);
		home.unshift(game.gameData.teams.home.name);
		home.push(homeTotals.runs, homeTotals.hits, homeTotals.errors);

		return `
		|${headers.join("|")}
		|${alignment.join("|")}
		|${away.join("|")}
		|${home.join("|")}
		`;
	}

	private static getHitInfo(game: LiveData, isAway: boolean)
	{
		const firstInningWithHit = game.liveData.plays.playsByInning.find(inning =>
		{
			const halfInning = isAway ? inning.hits.home : inning.hits.away;
			return halfInning.some(a => a.type === "H");
		});

		const halfInning = isAway
			? firstInningWithHit.hits.home
			: firstInningWithHit.hits.away;

		const firstHit = halfInning.find(a => a.type === "H");

		const inningNumber = game.liveData.plays.playsByInning.indexOf(firstInningWithHit);

		return `The no-hit attempt ended after ${firstHit.batter.fullName} got a hit during inning ${inningNumber + 1}.`;
	}

	private static getPostText(pitcherData: BoxScorePlayer, game: LiveData, isAway: boolean)
	{
		const againstTeam = isAway
			? game.gameData.teams.home.name
			: game.gameData.teams.away.name;

		const now = moment();
		const updatedString = now.format("h:mma, MMM D YYYY");

		const isNoHitter = this.isNoHitter(game);

		const isWasStatus = isNoHitter
			? "is"
			: "was";

		const finalInningCount = !isNoHitter
			? this.getHitInfo(game, isAway)
			: "";

		const isFinal = Utility.Mlb.gameIsFinal(game.gameData.status.statusCode);
		const isNoHitterFinal = game.gameData.flags.noHitter;
		const isPerfectGame = game.gameData.flags.perfectGame;

		let statusString = `${pitcherData.person.fullName} ${isWasStatus} pitching a no-hitter against the ${againstTeam}`;

		if (isFinal)
		{
			const perfectGameString = isPerfectGame ? " It was a perfect game!" : "";
			
			statusString = isNoHitterFinal
				? `${pitcherData.person.fullName} has no-hit the ${againstTeam}!${perfectGameString}`
				: `${pitcherData.person.fullName} got close, but failed to no-hit the ${againstTeam}`;
		}

		const text = `
			Last updated: ${updatedString}, Pacific Time
			
			#${statusString} 
			
			${finalInningCount}
			
			${this.generateBoxScore(game)}

			View [GameCast at MLB.com](https://www.mlb.com/gameday/${game.gamePk})
		`;

		return RedditAccess.detabify(text);
	}

	private static makePost(pitcherData: BoxScorePlayer, game: LiveData, isAway: boolean)
	{
		const text = this.getPostText(pitcherData, game, isAway);

		const subreddit: any = RedditAccess.Instance.Snoo
			.getSubreddit("BaseballTheaterBot");

		subreddit
			.submitSelfpost({
				subredditName: "BaseballTheaterBot",
				title: `No-H****r Alert: ${pitcherData.person.fullName}`,
				text
			})
			.then(data =>
			{
				CustomStorage.Instance.Store.setItem(game.gamePk.toString(), data.name);
			});
	}

	private static makeOrEditPost(pitcherData: BoxScorePlayer, game: LiveData, isAway: boolean)
	{
		const gamePk = game.gamePk.toString();

		const existingPost = CustomStorage.Instance.Store.getItem(gamePk);
		if (existingPost)
		{
			const text = this.getPostText(pitcherData, game, isAway);

			RedditAccess.Instance.Snoo
				.getSubmission(existingPost)
				.edit(text)
				.then(data =>
				{
					console.log(data);
				});
		}
		else
		{
			this.makePost(pitcherData, game, isAway);
		}
	}

	public static check(game: LiveData)
	{
		if (!this.gameIsValid(game))
		{
			return
		}

		const isNoHitter = this.isNoHitter(game);

		const awayHits = game.liveData.linescore.teams.away.hits;

		const posted = CustomStorage.Instance.Store.getItem(game.gamePk.toString());

		if (isNoHitter || posted)
		{
			try
			{
				const isAway = awayHits === 0;
				const pitcher = isAway
					? game.liveData.boxscore.teams.away.pitchers[0]
					: game.liveData.boxscore.teams.home.pitchers[0];

				if (pitcher)
				{
					const pitcherData = Utility.Mlb.getStatsForPlayerId(pitcher, game);

					if (pitcherData)
					{
						this.makeOrEditPost(pitcherData, game, isAway);
					}
				}
			}
			catch (e)
			{
				console.error(e);
			}
		}
	}


}