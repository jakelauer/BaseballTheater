// ReSharper disable InconsistentNaming

namespace Theater
{
	export class BackersList
	{
		public static Instance = new BackersList();

		public backers: Backers = null;
		public goalPercentage: number = 0;

		public async getBackers()
		{
			if (!this.backers)
			{
				var x = await this.populateBackersList();
			}

			return this.backers;
		}

		public populateBackersList(): Promise<PatreonData>
		{
			return new Promise((resolve: () => void, reject) =>
			{
				$.ajax({
					url: "/Data/Patreon",
					dataType: "json",
					success: (response: PatreonData) =>
					{
						this.backers = response.Backers;
						this.goalPercentage = response.GoalPercentage * 100;

						$(".patreon-goals .bar .width").width(`${this.goalPercentage}%`);
						resolve();
					}
				});
			});
		}


		public getTeamSponsorsCount(teamCode: string | number)
		{
			var sponsors = 0;

			if (this.backers)
			{
				for (var team of this.backers.TeamSponsors)
				{
					var matchThis = typeof teamCode === "string" ? Teams[teamCode] : teamCode;

					if (team.team === matchThis)
					{
						sponsors = team.backers.length;
						break;
					}
				}
			}

			return sponsors;
		};

		public getTeamSponsors(teamCode: string | number)
		{
			var sponsors = this.getTeamSponsorsCount(teamCode);

			var fanLingo = sponsors === 1 ? "fan" : "fans";
			return `${sponsors} ${fanLingo}`;
		}
	}

	export enum Teams
	{
		none,
		ari,
		atl,
		bal,
		bos,
		chc,
		cin,
		chw,
		cle,
		col,
		det,
		hou,
		kc,
		ana,
		la,
		mia,
		mil,
		min,
		nym,
		nyy,
		oak,
		phi,
		pit,
		stl,
		sd,
		sf,
		sea,
		tb,
		tex,
		tor,
		was
	}
}