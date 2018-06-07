import * as React from "react";
import {List} from "antd";
import {IPlayer, LiveGamePlay, LiveGamePlayEvent} from "@MlbDataServer/Contracts";
import {IPlayByPlayPitchData} from "../../components/GameDetail/play-by-play/play_by_play_pitches";
import {AbstractFullnameIdLink} from "@MlbDataServer/Contracts/live";

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

	public static renderPitch(pitch: LiveGamePlayEvent, pitchIndex: number)
	{
		return <List.Item>
			<div className={`pitch`} key={pitchIndex} data-type={pitch.details.call.code}>
				<div className={`pitch-count`}>{pitchIndex + 1}</div>
				<div className={`pitch-description`}>{pitch.details.call.description}</div>
				<div className={`pitch-details`}>
					{pitch.pitchData.startSpeed} MPH {pitch.details.type.description}
				</div>
			</div>
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
}