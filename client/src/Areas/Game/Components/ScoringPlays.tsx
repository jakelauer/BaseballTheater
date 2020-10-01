import {LiveGameData, LiveGamePlay} from "baseball-theater-engine";
import {PlayItem} from "./PlayItem";
import React from "react";
import {Chip, List} from "@material-ui/core";
import {StringUtils} from "../../../Utility/StringUtils";
import classNames from "classnames";
import styles from "./ScoringPlays.module.scss";
import {GameDataStoreContext} from "./GameDataStore";
import {GoArrowSmallRight} from "react-icons/go";
import {Alert} from "@material-ui/lab";

interface IScoringPlaysProps
{
	liveData: LiveGameData;
}

export const ScoringPlays: React.FC<IScoringPlaysProps> = (
	{liveData}
) =>
{
	const {
		plays,
	} = liveData;

	const scoringPlays = plays.scoringPlays.map(sp => plays.allPlays[sp]);

	const isNewInning = (prev: LiveGamePlay, curr: LiveGamePlay) =>
	{
		return prev?.about?.inning !== curr.about?.inning
			|| prev?.about?.halfInning !== curr.about?.halfInning;
	};

	if (!scoringPlays?.length)
	{
		return (
			<Alert severity={"error"} style={{flex: 1}}>
				Neither team has scored
			</Alert>
		);
	}

	return (
		<GameDataStoreContext.Consumer>
			{gameData => (gameData?.liveData?.gameData &&
                <List>
					{scoringPlays.map((sp, i) =>
					{
						const prevPlay = scoringPlays[i - 1];
						const showInning = isNewInning(prevPlay, sp);
						const team = sp.about.halfInning === "bottom"
							? gameData.liveData.gameData.teams.home
							: gameData.liveData.gameData.teams.away;

						const teamColorClasses = classNames(styles.teamColorPrimary, styles[team.fileCode], styles.chip);

						return (
							<>
								{showInning && (
									<Chip
										className={teamColorClasses}
										variant={"outlined"}
										label={
											<div className={styles.chipContent}>
												{team.abbreviation}
												<GoArrowSmallRight style={{fontSize: "1.5rem"}}/>
												{StringUtils.toProperCase(sp.about.halfInning)} {sp.about.inning}
											</div>
										}
									/>
								)}
								<PlayItem
									defaultExpanded={false}
									play={sp}
									showOtherEvents={false}
								/>
							</>
						);
					})}
                </List>
			)}
		</GameDataStoreContext.Consumer>
	);
}