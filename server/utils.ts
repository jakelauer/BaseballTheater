import * as fs from "fs";
import * as path from "path";
import { Request } from "express-serve-static-core";
import { Response } from "express";

interface IAppKeyJson {
	app: string;
	apiKey: string;
}

export class Utils {
	public static cachedValidApiKeys: IAppKeyJson[] = null;

	/**
	 * Determines whether the given API key matches the given app
	 * @param {Request} request The request to the server
	 * @returns {boolean} If false, no match found
	 */
	public static validateApiKey(request: Request) {
		const app = request.headers["x-app"];
		const key = request.headers["x-api-key"];

		if (app && key) {
			if (!Utils.cachedValidApiKeys) {
				const file = fs.readFileSync(path.resolve(process.cwd(), "./server/apikeys.json"), "utf8");
				Utils.cachedValidApiKeys = JSON.parse(file);
			}

			const matchingApp = Utils.cachedValidApiKeys.find(a => a.app === app);
			if (matchingApp) {
				return matchingApp.apiKey === key;
			}
		}

		return false;
	}

	public static send500(res: Response, error: Error) {
		res.status(500).json({ error: error.toString() })
	}
}
