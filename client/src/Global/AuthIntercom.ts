import {Intercom} from "./Intercom/intercom";

// @ts-ignore

export interface IAuthContext
{
	userId: string;
	authorized: boolean;
	levels: BackerTypes[];
	loaded: boolean;
	isSubscriber: boolean;
}

type BackerTypes = "Backer" | "Pro Backer" | "Star Backer" | "Premium Sponsor";

class _AuthIntercom extends Intercom<IAuthContext>
{
	public static Instance = new _AuthIntercom();

	private constructor()
	{
		super({
			authorized: false,
			userId: null,
			isSubscriber: false,
			loaded: false,
			levels: []
		});

		this.initialize();
	}

	private async initialize()
	{
		const user: { userId: string, accessToken: string, levels: BackerTypes[] } = await fetch("/auth/status")
			.then(r => r.json());

		this.update({
			authorized: !!user?.userId,
			userId: user?.userId,
			levels: user?.levels,
			loaded: true
		});
	}

	public refresh()
	{
		this.initialize();
	}

}

export const AuthIntercom = _AuthIntercom.Instance;