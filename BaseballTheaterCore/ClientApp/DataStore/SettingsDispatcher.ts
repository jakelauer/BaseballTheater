import {StoreDispatcher} from "./StoreDispatcher";

export interface ISettings
{
	favoriteTeam: string;
	defaultTab: string;
	hideScores: boolean;
}

export class SettingsDispatcher extends StoreDispatcher<ISettings>
{
    
}