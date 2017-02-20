var Theater;
(function (Theater) {
    class NewHome {
        initialize() {
            var summaries = Theater.MlbDataServer.GameSummaryCreator.getSummaryCollection(moment("2016/11/02", "YYYY/MM/DD"));
            summaries.then((result) => console.log(result));
        }
        dataBind() {
        }
    }
    Theater.NewHome = NewHome;
    $(document).on("ready", () => {
        var newHome = new NewHome();
        newHome.initialize();
    });
})(Theater || (Theater = {}));
//# sourceMappingURL=new.js.map