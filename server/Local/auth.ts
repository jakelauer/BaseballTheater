import * as oauth2 from "simple-oauth2";
import {OAuthClient} from "simple-oauth2";
import * as fs from "fs";
import * as path from "path";
import {Request, Response} from "express";
import {Utils} from "../utils";
import fetch from "cross-fetch";
import {Database} from "../DB/Database";
import moment from "moment";

class _Auth
{
	public static Instance = new _Auth();

	private readonly id: string;
	private readonly secret: string;
	private client: OAuthClient;

	private constructor()
	{
		const keysFile = fs.readFileSync(path.resolve(process.cwd(), "./server/config/keys.json"), "utf8");
		const keys = JSON.parse(keysFile)[0];

		// Use the client id and secret you received when setting up your OAuth account
		this.id = keys.patreon.id;
		this.secret = keys.patreon.secret;

		this.initialize();
	}

	private getRedirectUri(req: Request)
	{
		return `http://${req.headers.host}/auth/redirect`;
	}

	public initialize()
	{
		this.client = oauth2.create({
			client: {
				id: this.id,
				secret: this.secret
			},
			auth: {
				authorizeHost: "https://www.patreon.com",
				authorizePath: "/oauth2/authorize",
				tokenHost: "https://www.patreon.com",
				tokenPath: "/api/oauth2/token"
			}
		})
	}

	public authorize(req: Request, res: Response)
	{
		const authUrl = this.client.authorizationCode.authorizeURL({
			redirect_uri: this.getRedirectUri(req)
		});

		res.redirect(authUrl);
	}

	private setToken(tokenToUse: oauth2.Token, res: Response)
	{
		const token = this.client.accessToken.create(tokenToUse);

		res.cookie("token", token.token.access_token, {
			expires: new Date(8640000000000000)
		});

		const expiresAt = moment(token.token.expires_at);
		res.cookie("token_expiry", expiresAt.format(), {
			expires: new Date(8640000000000000)
		});

		return token;
	}

	public async getToken(req: Request, res: Response)
	{
		try
		{
			const result = await this.client.authorizationCode.getToken({
				code: req.query.code,
				redirect_uri: this.getRedirectUri(req)
			});

			const token = this.setToken(result, res);

			return token;
		}
		catch (e)
		{
			Utils.send500(res, e);
		}
	}

	public async storeUserToken(req: Request, res: Response)
	{
		const token = await this.getToken(req, res);
		const profileInfo = await fetch("https://www.patreon.com/api/oauth2/api/current_user", {
			headers: {
				authorization: `Bearer ${token.token.access_token}`
			}
		});

		const profileData = await profileInfo.json();
		const userId = profileData.data.id;

		res.cookie("id", userId, {
			expires: new Date(8640000000000000)
		});

		await Database.users.updateOne({id: userId}, {
			$set: {
				id: userId,
				refresh_token: token.token.refresh_token,
				refresh_expiry: token.token.expires_at
			}
		}, {upsert: true});

		console.log(profileData);
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
					const tokenToUse = this.client.accessToken.create({
						refresh_token: dbUser.refresh_token,
						access_token: storedToken,
						redirect_uri: this.getRedirectUri(req)
					});

					const newToken = await tokenToUse.refresh();

					this.setToken(newToken.token, res);
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