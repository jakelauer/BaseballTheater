import {ExpressEndpointMap} from "../server";
import {fetch} from "cross-fetch";

export const LocalEndpointMap: ExpressEndpointMap = {
	"/proxy/:url": (req, res, next) =>
	{
		const url = req.params.url;
		if (!url)
		{
			throw new Error("URL not provided");
		}

		const decodedUrl = decodeURI(url);
		fetch(decodedUrl)
			.then(response => response.json())
			.then(json =>
			{
				res.send({
					express: json
				});
			});
	}
};