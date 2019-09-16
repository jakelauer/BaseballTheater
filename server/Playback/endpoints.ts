import {ExpressEndpointMap} from "../server";
import {MlbDataServer, VideoSearchWithMetadata} from "../../baseball-theater-engine";

export const PlaybackEndpointMap: ExpressEndpointMap = {
	"/video/tag-search/:tag/:page": (req, res) =>
	{
		const MLB = new MlbDataServer();
		MLB.VideoTagSearch(req.params.tag, parseInt(req.params.page))
			.then((data: VideoSearchWithMetadata[]) =>
			{
				res.send(data);
			});

	}
};
