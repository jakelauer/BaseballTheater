import {LiveGameData} from "baseball-theater-engine";
import {PlayItem} from "./PlayItem";
import React from "react";
import {Chip, List} from "@material-ui/core";

interface IScoringPlaysProps
{
	liveData: LiveGameData;
}

export const ScoringPlays: React.FC<IScoringPlaysProps> = (
	{liveData}
) =>
{
	const {
		plays
	} = liveData;

	const scoringPlays = plays.scoringPlays.map(sp => plays.allPlays[sp]);

	return (
		<List>
			{scoringPlays.map((sp, i) =>
			{
				const prevPlay = scoringPlays[i - 1];
				const showInning = prevPlay?.about?.inning !== sp.about.inning;

				return (
					<>
						{showInning && (
							<Chip
								variant={"outlined"}
								style={{margin: "auto"}}
								label={`Inning ${sp.about.inning}`}
							/>
						)}
						<PlayItem play={sp}/>
					</>
				);
			})}
		</List>
	);
}