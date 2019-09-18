import * as fs from "fs";
import * as path from "path";
import {Request} from "express-serve-static-core";
import {Response} from "express";

interface IAppKeyJson
{
	app: string;
	apiKey: string;
}

export class Utils
{
	/**
	 * Determines whether the given API key matches the given app
	 * @param {Request} request The request to the server
	 * @returns {boolean} If false, no match found
	 */
	public static validateApiKey(request: Request)
	{
		const app = request.headers["x-app"];
		const key = request.headers["x-api-key"];

		if (app && key)
		{
			const file = fs.readFileSync(path.resolve(__dirname, "./apikeys.json"), "utf8");
			const json: IAppKeyJson[] = JSON.parse(file);

			const matchingApp = json.find(a => a.app === app);
			if (matchingApp)
			{
				return matchingApp.apiKey === key;
			}
		}

		return false;
	}

	public static send500(res: Response, error: Error)
	{
		res.status(500).json({error: error.toString()})
	}
}