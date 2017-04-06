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

type TeamSponsors = ITeamSponsorTeam[]

type PremiumSponsors = IPremiumSponsor[];

interface ITeamSponsorTeam {
	team: number;
	backers: string[];
}

interface IPremiumSponsor {
	backerName: string;
	team: number;
	url?: string;
}

interface Backers
{
	PremiumSponsors: PremiumSponsors;
	TeamSponsors: TeamSponsors;
	Backers: IBacker[];
}