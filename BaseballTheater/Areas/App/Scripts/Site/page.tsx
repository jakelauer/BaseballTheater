namespace Theater
{
	export interface ILocationDependentProps
	{
		onLocationTrigger: () => void;
	}

	export interface IPageRegister
	{
		matchingUrl: RegExp;
		page: React.ReactElement<ILocationDependentProps>;
		name: string;
	}
}