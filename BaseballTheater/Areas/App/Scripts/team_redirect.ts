namespace Theater
{
	export class TeamRedirect extends Site.Page
	{
		public static get TeamRedirectRegex()
		{
			return /^\/team\/([a-z]{2,3})\/game\/([0-9]+)\/?([0-9])?/ig;
		};

		public static Instance = new TeamRedirect();

		private team: string;
		private date: string;
		private gameWhich: string;

		public initialize()
		{
			this.testUrl();

			const matchingGame = this.getMatchingGame();
			matchingGame.then((game) =>
			{
				this.performRedirect(game);
			});
		}

		private performRedirect(game: IGameSummary)
		{
			const newpath = `/game/${this.date}/${game.game_pk}`;

			location.href = newpath;
		}

		private testUrl()
		{
			const regEx = TeamRedirect.TeamRedirectRegex;
			const data = location.pathname;
			const matches = regEx.exec(data);

			if (matches.length > 0)
			{
				matches.shift();
				for (let i = 0; i < matches.length; i++)
				{
					if (matches[i])
					{
						const item = matches[i];
						switch (i)
						{
						case 0:
							this.team = item;
							break;

						case 1:
							this.date = item;
							break;

						case 2:
							this.gameWhich = item;
							break;;
						}
					}
				}

				if (!this.gameWhich)
				{
					this.gameWhich = "1";
				}
			}
		}

		private async getMatchingGame()
		{
			const gameCollection = await MlbDataServer.GameSummaryCreator.getSummaryCollection(moment(this.date, "YYYYMMDD"));
			if (gameCollection)
			{
				const matches: IGameSummary[] = [];
				for (let game of gameCollection.games.games)
				{
					const teamMatched = game.away_file_code === this.team || game.home_file_code === this.team;
					if (teamMatched)
					{
						matches.push(game);
					}
				}

				if (matches.length > 0)
				{
					let returnMatch = matches[0];
					if (matches.length > 0 && this.gameWhich)
					{
						const gameWhichIndex = Number(this.gameWhich);
						if (matches.length > gameWhichIndex)
						{
							returnMatch = matches[gameWhichIndex];
						}
					}

					return returnMatch;
				}

				alert(`No match found on ${this.date} for ${this.team}`);
			}
		}

		public dataBind() {}

		public renew(pathname: string)
		{
		}

		public destroy() {}
	}


	Site.addPage({
		matchingUrl: TeamRedirect.TeamRedirectRegex,
		page: TeamRedirect.Instance
	});
}