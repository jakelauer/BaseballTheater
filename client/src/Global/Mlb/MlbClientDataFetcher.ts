import {MlbDataServer} from "baseball-theater-engine/dist";

class MlbClientDataFetcherInternal extends MlbDataServer
{
	public static Instance = new MlbClientDataFetcherInternal();

	private constructor()
	{
		super(url =>
		{
			const encodedUrl = encodeURIComponent(url);
			return `/api/proxy/${encodedUrl}`;
		});
	}
}

export const MlbClientDataFetcher = MlbClientDataFetcherInternal.Instance;