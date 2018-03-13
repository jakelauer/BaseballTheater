namespace Theater
{
	export interface IPageProps
	{
		settings: ISettings;
	}

	export interface IPageRegister
	{
		matchingUrl: RegExp;
		page: (props: IPageProps) => React.ReactElement<IPageProps>;
		name: string;
	}
}