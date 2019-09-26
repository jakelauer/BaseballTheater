import {Intercom} from "./Intercom/intercom";

export interface IAuthContext
{
	authorized: boolean;
}

class _AuthIntercom extends Intercom<IAuthContext>
{
	public static Instance = new _AuthIntercom();

	private constructor()
	{
		super({
			authorized: false
		});

		this.initialize();
	}

	private async initialize()
	{
		const data = await fetch("/auth/status")
			.then(r => r.json());

		this.update({
			authorized: data
		})
	}

	public refresh()
	{
		this.initialize();
	}

}

export const AuthIntercom = _AuthIntercom.Instance;