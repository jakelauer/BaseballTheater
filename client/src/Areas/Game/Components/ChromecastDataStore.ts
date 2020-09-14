import {DataStore} from "../../../Global/Intercom/DataStore";

export interface ChromecastDataStorePayload
{
	available: boolean;
}

class _ChromecastDataStore extends DataStore<ChromecastDataStorePayload>
{
	public static Instance = new _ChromecastDataStore({
		available: false
	});

	public setAvailable(isAvailable: boolean)
	{
		this.update({
			available: isAvailable
		})
	}
}

export const ChromecastDataStore = _ChromecastDataStore.Instance;