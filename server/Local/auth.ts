import * as fs from "fs";
import * as path from "path";
import {Request, Response} from "express";
import fetch from "cross-fetch";
import {Database} from "../DB/Database";
import moment from "moment";
import ClientOAuth2 from "client-oauth2";

class _Auth
{
	public static Instance = new _Auth();

	private readonly id: string;
	private readonly secret: string;
	private client: ClientOAuth2;

	private constructor()
	{
		const keysFile = fs.readFileSync(path.resolve(process.cwd(), "./server/config/keys.json"), "utf8");
		const keys = JSON.parse(keysFile)[0];

		// Use the client id and secret you received when setting up your OAuth account
		this.id = keys.patreon.id;
		this.secret = keys.patreon.secret;

		this.initialize();
	}

	private getRedirectUri()
	{
		return `https://beta.baseball.theater/auth/redirect`;
	}

	public initialize()
	{
		this.client = new ClientOAuth2({
			clientId: this.id,
			clientSecret: this.secret,
			accessTokenUri: 'https://www.patreon.com/api/oauth2/token',
			authorizationUri: 'https://www.patreon.com/oauth2/authorize',
			redirectUri: this.getRedirectUri(),
			scopes: ['notifications', 'gist']
		})
	}

	public authorize(req: Request, res: Response)
	{
		const uri = this.client.code.getUri();

		res.redirect(uri);
	}

	public async storeUserToken(req: Request, res: Response)
	{
		const user = await this.client.code.getToken(req.originalUrl);
		console.log(user); //=> { accessToken: '...', tokenType: 'bearer', ... }

		const token = user.accessToken;

		const profileInfo = await fetch("https://www.patreon.com/api/oauth2/api/current_user", {
			headers: {
				authorization: `Bearer ${token}`
			}
		});

		const profileData = await profileInfo.json();
		const userId = profileData.data.id;

		res.cookie("id", userId, {
			expires: new Date(8640000000000000)
		});

		res.cookie("token", token, {
			expires: new Date(8640000000000000)
		});

		const expiresAt = moment();
		res.cookie("token_expiry", expiresAt.format(), {
			expires: new Date(8640000000000000)
		});

		// Refresh the current users access token.
		user.refresh().then(async function (updatedUser)
		{
			console.log(updatedUser !== user); //=> true
			console.log(updatedUser.accessToken);

			await Database.users.updateOne({id: userId}, {
				$set: {
					id: userId,
					refresh_token: updatedUser.refreshToken,
					refresh_expiry: "0"
				}
			}, {upsert: true});
		});
	}

	public async getRefreshAuthStatus(req: Request, res: Response)
	{
		if (!req.cookies)
		{
			return false;
		}

		const storedId = req.cookies["id"];
		const storedToken = req.cookies["token"];
		const storedTokenExpiry = req.cookies["token_expiry"];
		if (!storedId || !storedToken)
		{
			return false;
		}

		const foundUsers = await Database.users.find({
			id: storedId
		}).toArray();

		if (foundUsers && foundUsers.length === 1)
		{
			const dbUser = foundUsers[0];

			const refreshExpired = moment(dbUser.refresh_expiry).isBefore(moment());
			if (refreshExpired)
			{
				res.redirect("/auth/authorize");
			}

			const accessExpired = moment(storedTokenExpiry).isBefore(moment());
			if (accessExpired)
			{
				try
				{
					const tokenToUse = this.client.createToken(storedToken, dbUser.refresh_token);

					const newToken = await tokenToUse.refresh();

					res.cookie("token", newToken, {
						expires: new Date(8640000000000000)
					});
				}
				catch (e)
				{
					console.log(e);

					return false;
				}
			}

			return true;
		}
	}
}

export const Auth = _Auth.Instance;