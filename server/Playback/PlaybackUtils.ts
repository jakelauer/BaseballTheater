import {Utils} from "../utils";
import {Request, Response} from "express";

export class PlaybackUtils
{
	public static requireApiKey = (req: Request, res: Response) =>
	{
		const valid = Utils.validateApiKey(req);
		if (!valid)
		{
			const error = new Error("API Key not valid");

			res.status(500).json({error: error.toString()})
		}
	}
}
