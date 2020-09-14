import {ChromecastDataStore} from "./Areas/Game/Components/ChromecastDataStore";

declare var cast: any;
declare var chrome: any;


const initializeCastApi = function ()
{
	cast.framework.CastContext.getInstance().setOptions({
		receiverApplicationId:
		chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
	});
};

(window as any)['__onGCastApiAvailable'] = function (isAvailable: boolean)
{
	if (isAvailable)
	{
		initializeCastApi();

		ChromecastDataStore.setAvailable(true);
	}
};

export const X = "Lol";