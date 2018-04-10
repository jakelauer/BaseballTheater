interface IEnvironmentOverride<T>
{
	defaultValue: T;
	local?: T;
	beta?: T;
	prod?: T;
}

export default class Config
{
	private static getValueForEnvironment<T>(setting: IEnvironmentOverride<T>)
	{
		const isLocal = location.host.indexOf(".local") > -1;
		const isBeta = location.host.indexOf("beta.") > -1;
		const isProd = location.host.indexOf(".theater") > -1;

		let value = setting.defaultValue;
		if (isLocal && "local" in setting) value = setting.local;
		if (isBeta && "beta" in setting) value = setting.beta;
		if (isProd && "prod" in setting) value = setting.prod;

		return value;
	}
	
	private static _loginEnabled: IEnvironmentOverride<boolean> = {
		defaultValue: false,
		local: true,
		beta: true
	};

	public static get loginEnabled()
	{
		return this.getValueForEnvironment(this._loginEnabled);
	}

	private static _liveDataEnabled: IEnvironmentOverride<boolean> = {
		defaultValue: false,
		local: true,
		beta: true
	};

	public static get liveDataEnabled()
	{
		return this.getValueForEnvironment(this._liveDataEnabled);
	}
}