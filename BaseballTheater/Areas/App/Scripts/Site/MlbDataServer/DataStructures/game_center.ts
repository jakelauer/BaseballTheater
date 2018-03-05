namespace Theater
{
	export interface IGameCenter
	{
		status: string;
		id: string;
		venueShort: string;
		venueLong: string;
		wrap: IWrap;
	}

	export interface IWrap
	{
		mlb: IMlb;
	}

	export interface IMlb
	{
		headline: string;
		blurb: string;
		url: IGCUrl;
	}

	export interface IGCUrl
	{
		cid: string;
	}
}