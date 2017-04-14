namespace Theater
{
	Vue.component("boxscore",
	{
		template: $("template#boxscore").html(),
		props: ["boxScore"],
		methods: {
		}
	});

	Vue.component("batter",
	{
		template: $("template#batter").html(),
		props: ["batter"],
		methods: {
		}
	});

	Vue.component("pitcher",
	{
		template: $("template#pitcher").html(),
		props: ["pitcher"],
		methods: {
			getIP: (outs: number) =>
			{
				var fullIP = Math.floor(outs / 3);
				var remainingOuts = outs - (fullIP * 3);
				return `${fullIP}.${remainingOuts}`;
			}
		}
	});
}