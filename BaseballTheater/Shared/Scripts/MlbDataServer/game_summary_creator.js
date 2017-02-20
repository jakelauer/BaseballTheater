var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Theater;
(function (Theater) {
    var MlbDataServer;
    (function (MlbDataServer) {
        class GameSummaryCreator {
            static buildUrl(date) {
                var yearFolder = `year_${date.format("YYYY")}`;
                var monthFolder = `month_${date.format("MM")}`;
                var dayFolder = `day_${date.format("DD")}`;
                return `${this.urlBase}/components/game/mlb/${yearFolder}/${monthFolder}/${dayFolder}/master_scoreboard.xml`;
            }
            static getSummaryCollection(date) {
                return __awaiter(this, void 0, void 0, function* () {
                    var url = this.buildUrl(date);
                    var gameSummaryCollection = yield MlbDataServer.Utils.XmlLoader.load(url);
                    return gameSummaryCollection;
                });
            }
        }
        GameSummaryCreator.urlBase = "http://gd2.mlb.com";
        MlbDataServer.GameSummaryCreator = GameSummaryCreator;
    })(MlbDataServer = Theater.MlbDataServer || (Theater.MlbDataServer = {}));
})(Theater || (Theater = {}));
//# sourceMappingURL=game_summary_creator.js.map