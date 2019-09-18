import {fetch} from "cross-fetch";
import {Express} from "express";

export const RegisterLocalEndpoints = (app: Express) =>
{
	app.get("/api/proxy/:url", (req, res, next) =>
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
				res.send(json);
			});
	});
};