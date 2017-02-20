var Theater;
(function (Theater) {
    class Linescore {
    }
    Theater.Linescore = Linescore;
    class HomeAway {
    }
    Theater.HomeAway = HomeAway;
    class Inning extends HomeAway {
    }
    Theater.Inning = Inning;
    class Runs extends HomeAway {
    }
    Theater.Runs = Runs;
    class Hits extends HomeAway {
    }
    Theater.Hits = Hits;
    class Errors extends HomeAway {
    }
    Theater.Errors = Errors;
    class GameStatus {
    }
    Theater.GameStatus = GameStatus;
    var League;
    (function (League) {
        League[League["AA"] = 0] = "AA";
        League[League["NN"] = 1] = "NN";
    })(League = Theater.League || (Theater.League = {}));
})(Theater || (Theater = {}));
//# sourceMappingURL=linescore.js.map