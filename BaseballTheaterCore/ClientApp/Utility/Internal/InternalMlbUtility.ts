import {LiveGamePlay} from "@MlbDataServer/Contracts";
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
}