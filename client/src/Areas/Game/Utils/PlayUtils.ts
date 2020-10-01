import {LiveGameData, LiveGamePlay} from "baseball-theater-engine";

export interface IHalfInning
{
	inningNumber: number;
	halfInning: "top" | "bottom";
	plays: LiveGamePlay[];
}

export class PlayUtils
{
	public static getHalfInningsByInning(liveData: LiveGameData)
	{
		if (!liveData)
		{
			return [];
		}

		const result = liveData.linescore.innings.map((inning, i) =>
		{
			const playsForInning = liveData.plays.allPlays.filter(a => a.about.inning === i + 1);
			const playsByInning: { [key: string]: IHalfInning } = {};
			let lastInningVal = "-1bottom";

			for (let play of playsForInning)
			{
				const inningVal = `${play.about.inning}${play.about.halfInning}`;
				const isNew = inningVal !== lastInningVal;
				if (isNew)
				{
					playsByInning[inningVal] = {
						inningNumber: play.about.inning,
						halfInning: play.about.halfInning,
						plays: []
					}
				}

				playsByInning[inningVal].plays.push(play);

				lastInningVal = inningVal;
			}

			return playsByInning;
		});

		return result;
	}
}