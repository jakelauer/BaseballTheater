import {ExpressEndpointMap, MLB} from "../server";
import {VideoSearchWithMetadata} from "baseball-theater-engine/dist";

export const PlaybackEndpointMap: ExpressEndpointMap = {
	"/video/tag-search/:tag/:page": (req, res) =>
	{
		MLB.VideoTagSearch(req.params.tag, parseInt(req.params.page))
			.then((data: VideoSearchWithMetadata[]) =>
			{
				res.send({
					express: data
				});
			});

	}
};
