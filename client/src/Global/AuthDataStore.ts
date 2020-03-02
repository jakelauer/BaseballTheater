import {DataStore} from "./Intercom/DataStore";

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
	None = "",
	Backer = "Backer",
	ProBacker = "Pro Backer",
	StarBacker = "Star Backer",
	PremiumSponsor = "Premium Sponsor"
}

const BackerLevelMap = {
	[BackerType.Backer]: [BackerType.Backer],
	[BackerType.ProBacker]: [BackerType.Backer, BackerType.ProBacker],
	[BackerType.StarBacker]: [BackerType.Backer, BackerType.ProBacker, BackerType.StarBacker],
	[BackerType.PremiumSponsor]: [BackerType.Backer, BackerType.ProBacker, BackerType.StarBacker, BackerType.PremiumSponsor],
};

class _AuthDatastore extends DataStore<IAuthContext>
{
	public static Instance = new _AuthDatastore();

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
		const user: { userId: string, accessToken: string, levels: BackerType } = await fetch("/auth/status")
			.then(r => r.json());

		const levels = user.levels
			? BackerLevelMap[user.levels]
			: [BackerType.None];

		this.update({
			authorized: !!user?.userId,
			userId: user?.userId,
			levels,
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

export const AuthDataStore = _AuthDatastore.Instance;