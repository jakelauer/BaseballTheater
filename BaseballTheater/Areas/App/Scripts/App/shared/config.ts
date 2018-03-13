namespace Theater
{
	interface IConfig
	{
		loginEnabled: boolean;
		liveDataEnabled: boolean;
	}

	export var Config: IConfig = {
		loginEnabled: false,
		liveDataEnabled: false
	}
}