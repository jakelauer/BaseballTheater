import {RouteComponentProps} from "react-router";

export interface IPageProps<TRouteParams> extends RouteComponentProps<TRouteParams>
{
	settings: ISettings;
}

export interface ISettings
{
	favoriteTeam: string;
	defaultTab: string;
	hideScores: boolean;
}