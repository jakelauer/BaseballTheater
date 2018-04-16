import {PageData} from "../../Utility/PageData";
import Config, {Environments} from "../Config/config";
import {FeatureFlags} from "../Config/FeatureFlags";

export interface IAuthContext
{
	IsAuthenticated: boolean;
	Features: IFeatures;
}

export interface IFeatures
{
	Beta: boolean;
	LiveData: boolean;
	TeamSchedule: boolean;
}

export class AuthContext implements IAuthContext
{
	public IsAuthenticated: boolean;
	public Features: IFeatures = {
		Beta: false, 
		LiveData: false,
		TeamSchedule: false
	};

	public static Instance = new AuthContext();

	public initialize()
	{
		const authPageData = PageData.getPageData<boolean>("IsAuthenticated");
		if (authPageData)
		{
			this.IsAuthenticated = authPageData;
		}

		const featuresPageData = PageData.getPageData<FeatureFlags>("FeatureFlags");
		if (featuresPageData !== null && featuresPageData !== undefined)
		{
			this.Features.Beta = !!(featuresPageData & FeatureFlags.Beta);
			this.Features.LiveData = !!(featuresPageData & FeatureFlags.LiveData) || Config.Environment === Environments.Local;
			this.Features.TeamSchedule = !!(featuresPageData & FeatureFlags.TeamSchedule);
		}
	}
}
