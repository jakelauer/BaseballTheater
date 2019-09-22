import {fetch} from "cross-fetch";
import {Express} from "express";
import {NextFunction, Request, Response} from "express-serve-static-core";

export const RegisterLocalEndpoints = (app: Express, clientFolder: string) =>
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

	app.get("*", (req: Request, res: Response, next: NextFunction) =>
	{
		res.sendFile("index.html", {root: clientFolder});
	});
};