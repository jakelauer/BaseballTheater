import * as React from "react";
import {List} from "antd";
import {LiveGamePlay, LiveGamePlayEvent} from "@MlbDataServer/Contracts";
import {IPlayByPlayPitchData} from "../../components/GameDetail/play-by-play/play_by_play_pitches";

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
					{pitch.pitchData.startSpeed} MPH {pitch.type}
				</div>
			</div>
		</List.Item>;
	};
}