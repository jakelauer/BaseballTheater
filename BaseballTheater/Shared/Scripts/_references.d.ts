declare var Pikaday: any;
declare var Cookies: any;

interface Window
{
	ga: (...args: any[]) => void;
}

interface JQueryStatic
{
	connection: any;
}

interface IBacker {
	backerName: string;
	isBeerBacker: boolean;
	isStarBacker: boolean;
}

interface ITeamSponsorTeam {
	team: number;
	backers: IBacker[];
}

interface IPremiumSponsor {
	backerName: string;
	team: number;
	url?: string;
	logo?: string;
}

interface Backers
{
	PremiumSponsors: IPremiumSponsor[];
	TeamSponsors: ITeamSponsorTeam[];
}

interface PatreonData
{
	Backers: Backers;
	GoalPercentage: number;
}

declare namespace __Modernizr
{
	interface FeatureDetects
	{
		mobile: boolean;
	}
}

declare namespace Flux
{
	export class Dispatcher<T>
	{
		public dispatch(...args: any[]);
		public register(...args: any[]);
	}
}

declare namespace FluxUtils
{
	export class ReduceStore<T, TPayload>
	{
		constructor(...args: any[]);

		public getState();
	}

	export class Container
	{
		public static createFunctional(...args: any[]);
	}
}