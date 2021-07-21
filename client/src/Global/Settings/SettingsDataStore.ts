import {DataStore} from "../Intercom/DataStore";
import {ITeams} from "../../../../baseball-theater-engine/contract";
import {GameTabs} from "../Routes/Routes";
import {AuthDataStore, BackerType} from "../AuthDataStore";

export interface ISettingsDataStorePayload
{
	favoriteTeams: (keyof ITeams)[];
	defaultGameTab: GameTabs;
	hideScores: boolean;
	highlightDescriptions: boolean;
	showUpdateBar: boolean;
}

class _SettingsDataStore extends DataStore<ISettingsDataStorePayload>
{
	private static LocalStorageKey = "settings";

	public static Instance = new _SettingsDataStore(_SettingsDataStore.getInitialState());

	private static getInitialState(): ISettingsDataStorePayload
	{
		return {
			defaultGameTab: "Highlights",
			favoriteTeams: [],
			hideScores: false,
			highlightDescriptions: true,
			showUpdateBar: true
		};
	}

	constructor(initial: ISettingsDataStorePayload)
	{
		super(initial);

		this.initialize();
	}

	public async initialize()
	{
		AuthDataStore.listen(async () =>
		{
			const loadedSettings = AuthDataStore.hasLevel(BackerType.Backer)
				? await this.loadSubscriberSettings()
				: _SettingsDataStore.loadLocalSettings();

			this.update(loadedSettings);
		});
	}

	protected update(data: Partial<ISettingsDataStorePayload>)
	{
		const isDifferent = JSON.stringify(data) !== JSON.stringify(this.state);

		super.update(data);

		if (isDifferent)
		{
			this.store();
		}
	}

	public setFavoriteTeams(teams: (keyof ITeams)[])
	{
		this.update({
			favoriteTeams: teams.filter(t => t.toLocaleLowerCase() !== "chw")
		});
	}

	public setDefaultGameTab(tab: GameTabs)
	{
		this.update({
			defaultGameTab: tab
		});
	}

	public setHideScores(hideScores: boolean)
	{
		this.update({
			hideScores
		})
	}

	public setShowDescriptions(show: boolean)
	{
		this.update({
			highlightDescriptions: show
		});
	}

	public setShowUpdateBar(show: boolean)
	{
		this.update({
			showUpdateBar: show
		});
	}

	private async store()
	{
		if (AuthDataStore.hasLevel(BackerType.Backer))
		{
			const toStore = {...this.state} as any;
			if ("settings" in toStore)
			{
				delete toStore.settings;
			}

			await fetch("/auth/save-settings", {
				method: "POST",
				body: JSON.stringify(toStore)
			});
		}
		else
		{
			_SettingsDataStore.storeLocalSettings(this.state);
		}
	}

	private async loadSubscriberSettings()
	{
		try
		{
			const {settings} = await fetch("/auth/get-settings").then(r => r.json());

			return settings;
		}
		catch (e)
		{
			console.error(e);

			return null;
		}
	}

	private static loadLocalSettings()
	{
		const storedSettingsString = localStorage.getItem(_SettingsDataStore.LocalStorageKey);
		if (!storedSettingsString)
		{
			return {};
		}

		return JSON.parse(storedSettingsString) as ISettingsDataStorePayload;
	}

	private static storeLocalSettings(state: ISettingsDataStorePayload)
	{
		localStorage.setItem(_SettingsDataStore.LocalStorageKey, JSON.stringify(state));
	}

}

export const SettingsDataStore = _SettingsDataStore.Instance;