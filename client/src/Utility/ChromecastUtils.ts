import {MouseEvent} from "react";
import {AuthDataStore, BackerType} from "../Global/AuthDataStore";
import {UpsellDataStore} from "../Areas/Game/Components/UpsellDataStore";

declare var cast: any;
declare var chrome: any;

export class ChromecastUtils
{
	public static TryCast(e: MouseEvent, href: string)
	{
		const castSession = cast.framework.CastContext.getInstance().getCurrentSession();
		if (castSession)
		{
			e.preventDefault();

			const isProBacker = AuthDataStore.hasLevel(BackerType.ProBacker);

			if (!isProBacker)
			{
				UpsellDataStore.open(BackerType.ProBacker);

				return;
			}

			const mediaInfo = new chrome.cast.media.MediaInfo(href, "video/mp4");
			var request = new chrome.cast.media.LoadRequest(mediaInfo);
			castSession.loadMedia(request).then(
				function ()
				{
					console.log('Load succeed');
				},
				function (errorCode: string)
				{
					console.log('Error code: ' + errorCode);
				});
		}
	}

	public static hijackCastClick(e: MouseEvent)
	{
		const isProBacker = AuthDataStore.hasLevel(BackerType.ProBacker);

		if (!isProBacker)
		{
			e.preventDefault();
			e.stopPropagation();
			UpsellDataStore.open(BackerType.ProBacker);
		}
	}
}