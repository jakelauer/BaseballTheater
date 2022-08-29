import apicache from 'apicache';
import { fetch } from 'cross-fetch';
import { Express } from 'express';

import { Config } from '../config/config';
import { Auth } from './auth';
import { changelist } from './changelist';
import { Search } from './search';

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

	app.get("/api/search", cache("5 minutes"), async (req, res) =>
	{
		const text: string = req.query.text;
		const gameIds = req.query.gameIds?.split(",")?.map((s: string) => parseInt(s));
		const page = parseInt(req.query.page);
		const perPage = parseInt(req.query.perPage ?? 20);

		try
		{
			const results = await Search.doSearchFromES({text, gameIds}, page, perPage) ?? [];

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

		let host = Config.host.replace("local:8000", "local:3000");
		if (host.match(/:[0-9]/))
		{
			host = host.replace("http", "https");
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

	app.get("*", (req, res, next) =>
	{
		res.sendFile("index.html", {root: clientFolder});
	});
};