import {fetch} from "cross-fetch";
import {Express} from "express";
import {NextFunction, Request, Response} from "express-serve-static-core";
import {Auth} from "./auth";
import {Search} from "./search";
import apicache from "apicache";
import {Config} from "../config/config";
import {changelist} from "./changelist";

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

	app.get("/api/search", cache("1 minute"), async (req, res) =>
	{
		const text: string = req.query.text;
		const gameIds = req.query.gameIds?.split(",")?.map((s: string) => parseInt(s));
		const page = parseInt(req.query.page);

		try
		{
			const results = await Search.doSearch({text, gameIds}, page) ?? [];

			res.send(results);
		}
		catch (e)
		{
			throw e;
		}
	});

	app.get("/api/changelist", cache("1 minute"), (req, res) =>
	{
		try
		{
			res.send(changelist);
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

		let host = Config.host.replace("local:5000", "local:3000");
		if (host.includes(":"))
		{
			host.replace("http", "https");
		}

		const state = decodeURIComponent(req.query.state) || "/";

		res.redirect(host + state);
	});

	app.get("/auth/status", async (req, res) =>
	{
		const result = await Auth.getRefreshAuthStatus(req, res);

		res.send(result ?? {});
	});

	app.post("/auth/save-settings", async (req, res) =>
	{
		await Auth.saveSettings(req);

		res.send();
	});

	app.get("/auth/get-settings", async (req, res) =>
	{
		const foundSettings = await Auth.getSettings(req);

		res.send(foundSettings);
	});

	app.get("*", (req: Request, res: Response, next: NextFunction) =>
	{
		res.sendFile("index.html", {root: clientFolder});
	});
};