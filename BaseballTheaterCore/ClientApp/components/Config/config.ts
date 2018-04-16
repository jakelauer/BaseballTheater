interface IEnvironmentOverride<T>
{
	defaultValue: T;
	local?: T;
	beta?: T;
	prod?: T;
}

export enum Environments
{
	Local,
	Beta,
	Prod
}

const configs: { [key: string]: IEnvironmentOverride<any> } = {
	"loginEnabled": {
		defaultValue: false,
		local: true,
		beta: true
	},
	"liveDataEnabled": {
		defaultValue: false,
		local: true,
		beta: true
	}
};

export default class Config
{
	public static get Environment()
	{
		const isLocal = location.host.indexOf(".local") > -1;
		const isBeta = location.host.indexOf("beta.") > -1;

		let e = Environments.Prod;

		if (isLocal)
		{
			e = Environments.Local
		}

		if (isBeta)
		{
			e = Environments.Beta
		}

		return e;
	}

	private static getValueForEnvironment<T>(setting: IEnvironmentOverride<T>, ifNotFound: T)
	{
		let value = setting.defaultValue;
		
		switch (this.Environment)
		{
			case Environments.Local:
				value = setting.local;
				break;
			case Environments.Beta:
				value = setting.beta;
				break;
			case Environments.Prod:
				value = setting.prod;
				break;
		}

		return value;
	}

	public static get loginEnabled()
	{
		return this.getValueForEnvironment(configs["loginEnabled"], false);
	}

	public static get liveDataEnabled()
	{
		return this.getValueForEnvironment(configs["liveDataEnabled"], false);
	}
}