declare var Pikaday: any;
declare var Cookies: any;

interface Window
{
	ga: (...args: any[]) => void;
}

interface IBacker {
	backerName: string;
	isBeerBacker: boolean;
}

interface ITeamSponsorTeam {
	team: number;
	backers: string[];
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
	Backers: IBacker[];
}

interface PatreonData
{
	Backers: Backers;
	GoalPercentage: number;
}