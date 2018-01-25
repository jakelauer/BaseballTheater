namespace Theater
{
	export interface ILocationDependentProps
	{
		onLocationTrigger: () => void;
	}

	export interface IReactPageRegister
	{
		matchingUrl: RegExp;
		page: React.ReactElement<ILocationDependentProps>;
		name: string;
	}
}