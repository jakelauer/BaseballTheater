import ClientOAuth2 from 'client-oauth2';
import fetch from 'cross-fetch';
import * as crypto from 'crypto';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

import { Config } from '../config/config';
import { Database } from '../DB/Database';

interface TokenWithExpires extends ClientOAuth2.Token
{
	expires: Date;
}

interface IUserData
{
	userId: string;
	accessToken: string;
	accessTokenExpiry: Date;
}

interface IAuthStatus
{
	userId: string,
	accessToken: string,
	levels: string[]
}

class _Auth
{
	public static Instance = new _Auth();

	private static AuthCookieName = "auth";
	private static EncryptionKey: Buffer;
	private static EncryptionIv: Buffer;

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

		_Auth.EncryptionKey = new Buffer(keys.crypto.key32);
		_Auth.EncryptionIv = new Buffer(keys.crypto.iv16);
	}

	private static getRedirectUri()
	{
		return `${Config.host}/auth/redirect`;
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

		const profileInfo = await fetch("https://www.patreon.com/api/oauth2/api/current_user", {
			headers: {
				authorization: `Bearer ${user.accessToken}`
			}
		});

		const profileData = await profileInfo.json();
		const userId = profileData.data.id;
		const tokenExpiry = new Date(Date.now() + (1000 * 60));

		_Auth.setAuthCookie({
			accessToken: user.accessToken,
			accessTokenExpiry: tokenExpiry,
			userId
		}, res);

		await Database.updateUser(userId, {
			accessToken: user.accessToken,
			refresh_token: user.refreshToken,
			refresh_expiry: user.expires
		});
	}

	public async getRefreshAuthStatus(req: Request, res: Response): Promise<IAuthStatus>
	{
		if (!req.cookies)
		{
			req.cookies = {};
			console.log("AUTH: no cookies");
		}

		const authStatus: IAuthStatus = {
			accessToken: null,
			levels: [],
			userId: null
		};

		const storedUserData = _Auth.getAuthCookie(req);
		if (storedUserData)
		{
			authStatus.accessToken = storedUserData.accessToken;
			authStatus.userId = storedUserData.userId;

			const dbUser = await Database.getUser(storedUserData.userId);

			const now = new Date();
			const refreshExpired = now > dbUser.refresh_expiry;
			if (refreshExpired)
			{
				authStatus.userId = null;
				authStatus.accessToken = null;

				// Return null for everything
				return authStatus;
			}

			const accessExpired = now > storedUserData.accessTokenExpiry;
			if (accessExpired || !storedUserData.accessToken)
			{
				try
				{
					const newCreatedToken = this.client.createToken(storedUserData.accessToken, dbUser.refresh_token);
					const newRefreshedToken = await newCreatedToken.refresh() as TokenWithExpires;

					const newUserData: IUserData = {
						userId: storedUserData.userId,
						accessToken: newRefreshedToken.accessToken,
						accessTokenExpiry: new Date(Date.now() + (1000 * 60))
					};

					authStatus.userId = newUserData.userId;
					authStatus.accessToken = newUserData.accessToken;

					_Auth.setAuthCookie(newUserData, res);

					// Refresh the current users access token.
					await Database.updateUser(newUserData.userId, {
						accessToken: newRefreshedToken.accessToken,
						refresh_token: newRefreshedToken.refreshToken,
						refresh_expiry: newRefreshedToken.expires
					});
				}
				catch (e)
				{
					console.error(e);

					return authStatus;
				}
			}
		}

		authStatus.levels = await this.getSubscriberLevel(authStatus.userId, authStatus.accessToken);

		return authStatus;
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
		const storedUserData = _Auth.getAuthCookie(req);
		if (storedUserData)
		{
			await Database.updateUser(storedUserData.userId, {
				settings: req.body as Object
			});
		}
	}

	public async getSettings(req: Request)
	{
		const storedUserData = _Auth.getAuthCookie(req);
		if (storedUserData)
		{
			return await Database.getUser(storedUserData.userId);
		}

		return null;
	}

	private static setAuthCookie(userData: IUserData, res: Response)
	{
		const encrypted = _Auth.encodeUserInfo(userData);

		res.cookie(_Auth.AuthCookieName, encrypted, {
			expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 30)),
			httpOnly: false
		});
	}

	private static getAuthCookie(req: Request)
	{
		const authCookie = req.cookies[_Auth.AuthCookieName];
		if (authCookie)
		{
			return _Auth.decodeUserInfo(authCookie);
		}
	}

	private static encodeUserInfo(userData: IUserData): string
	{
		return _Auth.encrypt(JSON.stringify(userData));
	}

	private static decodeUserInfo(encoded: string): IUserData
	{
		const decrypted = _Auth.decrypt(encoded);

		return JSON.parse(decrypted) as IUserData;
	}

	private static encrypt(o: string | object)
	{
		const text = typeof o === "string" ? o : JSON.stringify(o);
		let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(_Auth.EncryptionKey), _Auth.EncryptionIv);
		let encrypted = cipher.update(text);
		encrypted = Buffer.concat([encrypted, cipher.final()]);
		return encrypted.toString('hex');
	}

	private static decrypt(text: string)
	{
		let encryptedText = Buffer.from(text, 'hex');
		let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(_Auth.EncryptionKey), _Auth.EncryptionIv);
		let decrypted = decipher.update(encryptedText);
		decrypted = Buffer.concat([decrypted, decipher.final()]);
		return decrypted.toString();
	}
}

export const Auth = _Auth.Instance;