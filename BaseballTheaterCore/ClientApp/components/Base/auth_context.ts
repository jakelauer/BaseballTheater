import {PageData} from "../../Utility/PageData";

export interface IAuthContext
{
	IsAuthenticated: boolean;
}

export class AuthContext implements IAuthContext
{
	public IsAuthenticated: boolean;

	public static Instance = new AuthContext();

	public initialize()
	{
		const pageData = PageData.getPageData<IAuthContext>("AuthContext");
		if (pageData)
		{
			this.IsAuthenticated = pageData.IsAuthenticated;
		}
	}
}
