import {fetch} from "cross-fetch";
import {Express} from "express";
import {NextFunction, Request, Response} from "express-serve-static-core";
import {Auth} from "./auth";
import {isProd} from "../config/config";
import {Search} from "./search";
import apicache from "apicache";

const cache = apicache.middleware;

export const RegisterLocalEndpoints = (app: Express, clientFolder: string) =>
{
	app.get("/api/proxy", cache("30 seconds"), (req, res, next) =>
	{
		const url = req.query.url;
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

	app.get("/api/search", cache("1 minute"), (req, res) =>
	{
		const text: string = req.query.text;
		const gameIds = req.query.gameIds?.split(",")?.map((s: string) => parseInt(s));
		const page = parseInt(req.query.page);

		try
		{
			const results = Search.doSearch({text, gameIds}, page) ?? [];

			res.send(results);
		}
		catch (e)
		{
			throw e;
		}
	});

	app.get("/auth/authorize", (req, res) =>
	{
		Auth.authorize(req, res);
	});

	app.get("/auth/redirect", async (req, res) =>
	{
		try
		{
			await Auth.storeUserToken(req, res);
		}
		catch (e)
		{
			throw e;
		}

		const host = !isProd
			? "http://localhost:3000"
			: ``;

		console.log(host);

		const state = decodeURIComponent(req.query.state) || "/";

		console.log(host + state);

		res.redirect(host + state);
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