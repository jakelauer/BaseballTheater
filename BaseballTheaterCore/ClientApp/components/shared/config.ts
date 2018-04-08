interface IConfig
{
	loginEnabled: boolean;
	liveDataEnabled: boolean;
}

export var Config: IConfig = {
	loginEnabled: true,
	liveDataEnabled: false
};