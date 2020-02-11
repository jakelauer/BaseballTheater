import {Intercom} from "./Intercom/intercom";

// @ts-ignore

export interface IAuthContext
{
	userId: string;
	authorized: boolean;
	levels: BackerType[];
	loaded: boolean;
	isSubscriber: boolean;
}

export enum BackerType
{
	Backer = "Backer",
	ProBacker = "Pro Backer",
	StarBacker = "Star Backer",
	PremiumSponsor = "Premium Sponsor"
}

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

	private get isOwner()
	{
		return this.state.userId === "5206592";
	}

	private async initialize()
	{
		const user: { userId: string, accessToken: string, levels: BackerType[] } = await fetch("/auth/status")
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

	public hasLevel(backerType: BackerType)
	{
		return this.state.levels?.indexOf(backerType) > -1 || this.isOwner;
	}

}

export const AuthIntercom = _AuthIntercom.Instance;