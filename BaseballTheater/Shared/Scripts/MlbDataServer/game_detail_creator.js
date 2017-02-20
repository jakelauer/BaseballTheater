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
        class GameDetailCreator {
            constructor(directory, directoryIsFullyQualified = false) {
                this.directoryUrl = directoryIsFullyQualified
                    ? directory
                    : GameDetailCreator.urlBase + directory;
                this.highlightsUrl = this.directoryUrl + "/media/mobile.xml";
                this.gameCenterUrl = this.directoryUrl + "/gamecenter.xml";
                this.gameSummaryUrl = this.directoryUrl + "/linescore.xml";
            }
            GetHighlights() {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield MlbDataServer.Utils.XmlLoader.load(this.highlightsUrl);
                });
            }
            GetGameCenter() {
                return __awaiter(this, void 0, void 0, function* () {
                    var gameCenterObj = yield MlbDataServer.Utils.XmlLoader.load(this.gameCenterUrl);
                    return gameCenterObj;
                });
            }
            GetGameSUmmary() {
                return __awaiter(this, void 0, void 0, function* () {
                    var gameSummaryObj = yield MlbDataServer.Utils.XmlLoader.load(this.gameSummaryUrl);
                    return gameSummaryObj;
                });
            }
            get(url) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        return yield MlbDataServer.Utils.XmlLoader.load(url);
                    }
                    catch (e) {
                        this.handleError(e);
                    }
                });
            }
            handleError(e) {
                console.error(e);
            }
        }
        GameDetailCreator.urlBase = "http://gd2.mlb.com";
        MlbDataServer.GameDetailCreator = GameDetailCreator;
    })(MlbDataServer = Theater.MlbDataServer || (Theater.MlbDataServer = {}));
})(Theater || (Theater = {}));
//# sourceMappingURL=game_detail_creator.js.map