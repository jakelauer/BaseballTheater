namespace Theater
{
	export class NewHome
	{
		private vueBind: vuejs.Vue;
		private highlightsCollection: IHighlightsCollection;

		public initialize()
		{
			var summaries = MlbDataServer.GameSummaryCreator.getSummaryCollection(moment("2016/11/02", "YYYY/MM/DD"));

			summaries.then((result) => console.log(result));
		}

		public dataBind()
		{
		}
	}

	$(document).on("ready", () =>
	{
		var newHome = new NewHome();
		newHome.initialize();
	});
}