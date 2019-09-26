import {fetch} from "cross-fetch";
import {Express} from "express";
import {NextFunction, Request, Response} from "express-serve-static-core";
import {Auth} from "./auth";

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

	app.get("/auth/authorize", (req, res) =>
	{
		Auth.authorize(req, res);
	});

	app.get("/auth/redirect", async (req, res) =>
	{
		await Auth.storeUserToken(req, res);

		res.redirect("http://localhost:3000");
	});

	app.get("/auth/status", async (req, res) =>
	{
		const result = await Auth.getRefreshAuthStatus(req, res);
		res.send(result);
	});

	app.get("*", (req: Request, res: Response, next: NextFunction) =>
	{
		res.sendFile("index.html", {root: clientFolder});
	});
};