import {MlbDataServer} from "baseball-theater-engine";

class MlbClientDataFetcherInternal extends MlbDataServer
{
	public static Instance = new MlbClientDataFetcherInternal();

	private constructor()
	{
		super(url =>
		{
			const encodedUrl = encodeURIComponent(url);
			return `/api/proxy/?url=${encodedUrl}`;
		});
	}
}

export const MlbClientDataFetcher = MlbClientDataFetcherInternal.Instance;