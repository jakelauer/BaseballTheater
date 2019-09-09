import {ExpressEndpointMap} from "../server";
import {VideoLoader} from "baseball-theater-engine/dist/engine/internal_videoloader";


export const PlaybackEndpointMap: ExpressEndpointMap = {
	"/video/tag-search/:tag/:page": (req, res) =>
	{
		VideoLoader.VideoTagSearch(req.params.tag, req.params.page)
			.then(data => {
				res.send({
					express: data
				});
			});

	}
};
