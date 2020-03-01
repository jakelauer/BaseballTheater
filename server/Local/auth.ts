import * as fs from "fs";
import * as path from "path";
import {Request, Response} from "express";
import fetch from "cross-fetch";
import {Database} from "../DB/Database";
import ClientOAuth2 from "client-oauth2";
import {isProd} from "../config/config";

interface TokenWithExpires extends ClientOAuth2.Token
{
	expires: Date;
}

class _Auth
{
	public static Instance = new _Auth();

	private static get host()
	{
		return !isProd
			? "http://jlauer.local:5000"
			: `https://beta.baseball.theater`;
	}

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

	private static getRedirectUri()
	{
		return `${_Auth.host}/auth/redirect`;
	}

	public initialize()
	{
		this.client = new ClientOAuth2({
			clientId: this.id,
			clientSecret: this.secret,
			accessTokenUri: 'https://www.patreon.com/api/oauth2/token',
			authorizationUri: 'https://www.patreon.com/oauth2/authorize',
			redirectUri: _Auth.getRedirectUri(),
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
		let user = await this.client.code.getToken(req.originalUrl, {
			redirectUri: _Auth.getRedirectUri()
		}) as TokenWithExpires;

		user = await user.refresh() as TokenWithExpires;

		const accessToken = user.accessToken;

		const profileInfo = await fetch("https://www.patreon.com/api/oauth2/api/current_user", {
			headers: {
				authorization: `Bearer ${accessToken}`
			}
		});

		const profileData = await profileInfo.json();
		const userId = profileData.data.id;

		res.cookie("id", userId, {
			expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 30))
		});

		res.cookie("accessToken", accessToken, {
			expires: new Date(Date.now() + (1000 * 60 * 2)),
			httpOnly: true
		});

		const tokenExpiry = new Date(Date.now() + (1000 * 60));
		res.cookie("token_expiry", tokenExpiry, {
			expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 30)),
			httpOnly: true
		});

		// Refresh the current users access token.
		await Database.users.updateOne({id: userId}, {
			$set: {
				id: userId,
				accessToken: user.accessToken,
				refresh_token: user.refreshToken,
				refresh_expiry: user.expires
			}
		}, {upsert: true});
	}

	public async getRefreshAuthStatus(req: Request, res: Response): Promise<{ userId: string, accessToken: string, levels: string[] }>
	{
		if (!req.cookies)
		{
			req.cookies = {};
			console.log("AUTH: no cookies");
		}

		const storedId = req.cookies["id"] || "";
		const storedAccessToken = req.cookies["accessToken"] || "";

		let userId: string = storedId;
		let accessToken = storedAccessToken;

		const storedAccessTokenExpiry = new Date(req.cookies["token_expiry"]);

		const foundUsers = await Database.users.find({
			id: storedId
		}).toArray();

		if (foundUsers && foundUsers.length === 1)
		{
			const dbUser = foundUsers[0];

			const now = new Date();
			const refreshExpired = now > dbUser.refresh_expiry;
			if (refreshExpired)
			{
				userId = null;
				accessToken = null;
			}

			const accessExpired = now > storedAccessTokenExpiry;
			if (accessExpired)
			{
				try
				{
					const tokenToUse = this.client.createToken(storedAccessToken, dbUser.refresh_token);

					const newToken = await tokenToUse.refresh() as TokenWithExpires;

					res.cookie("accessToken", newToken.accessToken, {
						expires: new Date(8640000000000000)
					});

					const tokenExpiry = new Date(Date.now() + (1000 * 60));
					res.cookie("token_expiry", tokenExpiry, {
						expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 30)),
						httpOnly: true
					});

					userId = storedId;
					accessToken = newToken.accessToken;

					// Refresh the current users access token.
					await Database.users.updateOne({id: userId}, {
						$set: {
							accessToken: newToken.accessToken,
							refresh_token: newToken.refreshToken,
							refresh_expiry: newToken.expires
						}
					}, {upsert: false});
				}
				catch (e)
				{
					console.log(e);

					return null;
				}
			}
		}

		const levels = await this.getSubscriberLevel(userId, accessToken);

		const userData = {
			userId,
			accessToken,
			levels
		};

		return userData;
	}

	private async getSubscriberLevel(userId: string, accessToken: string): Promise<string[]>
	{
		let levels: string[] = [];

		if (!userId || !accessToken)
		{
			return levels;
		}

		const profileInfo = await fetch("https://www.patreon.com/api/oauth2/api/current_user", {
			headers: {
				authorization: `Bearer ${accessToken}`
			}
		}).then(r => r.json());

		if (profileInfo && !profileInfo.errors && profileInfo.included && profileInfo.data.relationships && profileInfo.data.relationships.pledges)
		{
			const pledgeIds = profileInfo.data.relationships.pledges.data.map((p: any) => p.id);
			if (pledgeIds && pledgeIds.length)
			{
				const pledges = profileInfo.included.filter((i: any) => i.type === "pledge" && pledgeIds.includes(i.id));
				const rewardIds = pledges.map((p: any) => p.relationships.reward.data.id);
				const rewards = rewardIds.map((r: any) => profileInfo.included.find((i: any) => i.type === "reward" && i.id === r));
				levels = rewards.map((r: any) => r.attributes.title);
			}
		}

		return levels;
	}

	public async saveSettings(req: Request)
	{
		const storedId = req.cookies["id"] || "";
		const storedAccessToken = req.cookies["accessToken"] || "";

		// Refresh the current users access token.
		await Database.users.updateOne({id: storedId, accessToken: storedAccessToken}, {
			$set: {
				settings: req.body as Object
			}
		}, {upsert: false});
	}

	public async getSettings(req: Request)
	{
		const storedId = req.cookies["id"] || "";

		const foundUsers = await Database.users.find({
			id: storedId
		}).toArray();

		if (foundUsers && foundUsers.length === 1)
		{
			return foundUsers[0].settings;
		}

		return null;
	}
}

export const Auth = _Auth.Instance;