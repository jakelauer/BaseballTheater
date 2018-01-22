namespace Theater.Site
{
	export interface IReactPageRegister
	{
		matchingUrl: RegExp;
		page: React.Component;
		name: string;
	}
}