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
        var Utils;
        (function (Utils) {
            class XmlLoader {
                static load(url) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return new Promise((resolve, reject) => {
                            $.ajax({
                                url,
                                type: "GET",
                                dataType: "html",
                                success: (response) => {
                                    resolve(this.xmlToJson(response));
                                },
                                error: (error) => {
                                    reject(error);
                                }
                            });
                        });
                    });
                }
                static xmlToJson(xmlString) {
                    var x2js = new X2JS({
                        attributePrefix: ""
                    });
                    var json = x2js.xml_str2json(xmlString);
                    return json;
                }
            }
            Utils.XmlLoader = XmlLoader;
        })(Utils = MlbDataServer.Utils || (MlbDataServer.Utils = {}));
    })(MlbDataServer = Theater.MlbDataServer || (Theater.MlbDataServer = {}));
})(Theater || (Theater = {}));
//# sourceMappingURL=xml_loader.js.map