import {BackerType} from "../../../Global/AuthDataStore";
import {DataStore} from "../../../Global/Intercom/DataStore";

export interface UpsellDataStorePayload
{
	backerType: BackerType | null;
}

class _UpsellDataStore extends DataStore<UpsellDataStorePayload>
{
	public static Instance = new _UpsellDataStore({
		backerType: null
	});

	public open(backerType: BackerType)
	{
		this.update({
			backerType
		});
	}

	public close()
	{
		this.update({
			backerType: null
		});
	}
}

export const UpsellDataStore = _UpsellDataStore.Instance;