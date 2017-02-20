var Theater;
(function (Theater) {
    var MlbDataServer;
    (function (MlbDataServer) {
        class InterfaceClass {
            constructor(obj) {
                var _self = this;
                for (var key in obj) {
                    _self[key] = obj[key];
                }
            }
        }
        MlbDataServer.InterfaceClass = InterfaceClass;
    })(MlbDataServer = Theater.MlbDataServer || (Theater.MlbDataServer = {}));
})(Theater || (Theater = {}));
//# sourceMappingURL=interface_class.js.map