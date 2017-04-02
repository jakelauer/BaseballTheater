namespace Theater
{
	function getTeamCode(team: Teams)
	{
		return Teams[team];
	}

	Vue.component("backer",
	{
		template: $("template#backer").html(),
		props: ["backer"],
		methods: {
		}
	});

	Vue.component("beer-backer",
	{
		template: $("template#beer-backer").html(),
		props: ["backer"],
		methods: {
		}
	});

	Vue.component("team-sponsor",
	{
		template: $("template#team-sponsor").html(),
		props: ["teamSponsorTeam"],
		methods: {
			getTeamCode
		}
	});

	Vue.component("premium-sponsor",
	{
		template: $("template#premium-sponsor").html(),
		props: ["premiumSponsorTeam"],
		methods: {
			getTeamCode
		}
	});
}