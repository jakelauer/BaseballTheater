namespace Theater
{
	export interface IProbablePitcher
	{
		id: number;
		first_name: string;
		last_name: string;
		name_display_roster: string;
		number: number;
		throwinghand: string;
		wins: number;
		losses: number;
		era: number;
	}
}