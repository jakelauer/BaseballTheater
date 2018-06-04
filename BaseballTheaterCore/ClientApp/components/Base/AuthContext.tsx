import {Utility} from "@Utility/index";
import {FeatureFlags} from "../Config/FeatureFlags";

export interface IAuthContext
{
	IsAuthenticated: boolean;
	Features: IFeatures;
}

export interface IFeatures
{
	Beta: boolean;
	TeamSchedule: boolean;
}

export class AuthContext implements IAuthContext
{
	public IsAuthenticated: boolean;
	public Features: IFeatures = {
		Beta: false, 
		TeamSchedule: false
	};

	public static Instance = new AuthContext();

	public initialize()
	{
		const authPageData = Utility.PageData.getPageData<boolean>("IsAuthenticated");
		if (authPageData)
		{
			this.IsAuthenticated = authPageData;
		}

		const featuresPageData = Utility.PageData.getPageData<FeatureFlags>("FeatureFlags");
		if (featuresPageData !== null && featuresPageData !== undefined)
		{
			this.Features.Beta = !!(featuresPageData & FeatureFlags.Beta);
			this.Features.TeamSchedule = !!(featuresPageData & FeatureFlags.TeamSchedule);
		}
	}
}
