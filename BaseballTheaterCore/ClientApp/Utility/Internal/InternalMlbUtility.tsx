import * as React from "react";
import {Icon, List} from "antd";
import {GameData, IPlayer, LiveGamePlay, LiveGamePlayEvent, Player} from "@MlbDataServer/Contracts";
import {IPlayByPlayPitchData} from "../../components/GameDetail/play-by-play/play_by_play_pitches";
import {AbstractFullnameIdLink, LiveData, PlayerWithStats, PlayerWithBoxScoreStats} from "@MlbDataServer/Contracts/live";

export class InternalMlbUtility
{
	public static getPitchDataForPlay(play: LiveGamePlay)
	{
		const pitchEvents = play.playEvents.filter(a => a.isPitch);
		const pitchData: IPlayByPlayPitchData[] = [];
		pitchEvents.forEach(event => pitchData.push({
			x: event.pitchData.coordinates.x,
			y: event.pitchData.coordinates.y,
			type: event.details.call.code
		}));

		return pitchData;
	}

	public static renderPitch(play: LiveGamePlayEvent)
	{
		const detailDesc = play && play.details && play.details.description;
		const callDesc = play && play.details && play.details.call && play.details.call.description;
		const typeDesc = play && play.details && play.details.type && play.details.type.description;
		
		return <List.Item key={play.index}>
			{play.isPitch &&
			<div className={`pitch`} data-type={play.details.call.code}>
				<div className={`pitch-count`}>{play.pitchNumber}</div>
				<div className={`pitch-description`}>{callDesc}</div>
				<div className={`pitch-details`}>
					{play.pitchData.startSpeed} MPH {typeDesc}
				</div>
			</div>
			}

			{!play.isPitch &&
			<div className={`pitch special-event`} key={play.index}>
				<div className={`pitch-count`}>
					<Icon type="info" />
				</div>
				 {detailDesc}
			</div>
			}
		</List.Item>;
	};

	public static renderPlayerLinkXml(player: IPlayer)
	{
		const urlName = encodeURIComponent(player.name_display_first_last.replace(/[^a-z]/gi, "-").toLowerCase());
		const playerLink = `http://m.mlb.com/player/${player.id}/${urlName}`;

		return (<a href={playerLink} target={`_blank`}>{player.name}</a>);
	}

	public static renderPlayerLink(player: AbstractFullnameIdLink)
	{
		const urlName = encodeURIComponent(player.fullName.replace(/[^a-z]/gi, "-").toLowerCase());
		const playerLink = `http://m.mlb.com/player/${player.id}/${urlName}`;

		return (<a href={playerLink} target={`_blank`}>{player.fullName}</a>);
	}

	public static gameIsFinal(gameStatusCode: string)
	{
		if (gameStatusCode)
		{
			return gameStatusCode.startsWith("F")
				|| gameStatusCode.startsWith("C")
				|| gameStatusCode === "DR"
				|| gameStatusCode === "O";
		}
		
		return true;
	}

	public static getPlayerIdsFromGame(gameData: GameData)
	{
		const playerList = Object.values(gameData.players) as Player[];
		return playerList.map(a => a.id);
	}

	public static getStatsForPlayerId(playerId: number | string, liveData: LiveData): PlayerWithBoxScoreStats
	{
		const allPlayerStats = { ...liveData.liveData.boxscore.teams.away.players, ...liveData.liveData.boxscore.teams.home.players };
		return allPlayerStats[playerId] || allPlayerStats[`ID${playerId}`];
	}
}