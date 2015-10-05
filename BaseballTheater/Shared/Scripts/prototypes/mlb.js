(function() {
	var mlb = function (date) {
		this.date = date || new Date();

		this._urlBase = "http://gd2.mlb.com/components/game/mlb/";
		this._dayUrl = this.buildDateUrl(this.date);
		this._gamesUrl = this._dayUrl + "grid.xml";
		this._highlightsUrl = this._dayUrl + "media/highlights.xml";

		this._highlightsData = {};
		this._retryAttempts = 0;
	};

	mlb.prototype.init = function() {
		this.getGamesForDate(this.date);
	};

	mlb.prototype.getGamesForDate = function () {
		var self = this;

		this.getHighlights(function () {
			self.getGames();
		});
	};

	mlb.prototype.buildDateUrl = function(date) {
		var month = "" + (date.getMonth() + 1);
		var year = "" + date.getFullYear();
		var day = "" + date.getDate();

		month = month.length === 1 ? "0" + month : month;
		day = day.length === 1 ? "0" + day : day;

		var yearFolder = "year_" + year;
		var monthFolder = "month_" + month;
		var dayFolder = "day_" + day;

		return this._urlBase + yearFolder + "/" + monthFolder + "/" + dayFolder + "/";
	};

	mlb.prototype.getGames = function () {
		var self = this;

		$.ajax({
			url: this._gamesUrl,
			cache: true,
			type: "GET",
			data: null,
			success: function (response) {
				self.parseGames(response);
			},
			error: function () {
				if (self._retryAttempts === 0) {
					self.date.setDate(self.date.getDate() + 1);
					self.getGamesForDate();

					self._retryAttempts++;
				}

				alert("No games found");
			}
		});
	};

	mlb.prototype.getHighlights = function (callback) {
		var self = this;

		$.ajax({
			url: this._highlightsUrl,
			cache: true,
			type: "GET",
			data: null,
			success: function (response) {
				self.parseHighlights(response);
				callback();
			},
			error: function () {
				console.log("error");
			}
		});
	};

	mlb.prototype.parseGames = function (response) {
		var self = this;

		var $html = $(response);
		var $games = $html.find("game");

		$games.each(function () {
			var $game = $("<div class='game'/>");
			var id = $(this).attr("game_pk");

			var $homeTeam = $("<a/>").text($(this).attr("home_team_name")).attr("href", "http://m.mlb.com/video/search?game_pk=" + id);
			var $awayTeam = $("<a/>").text($(this).attr("away_team_name")).attr("href","http://m.mlb.com/video/search?game_pk=" + id);


			$game.append($homeTeam);
			$game.append($awayTeam);

			if (id in self._highlightsData) {
				var $highlights = self._highlightsData[id].find("media");
				$highlights.each(function () {
					var url = $(this).find("url").text();
					var $link = $("<video controls preload='none' width='400' height='2--' />").attr("src", url).text(url);

					$game.append($link);
					$game.append($("<br/>"));
				});
			}

			$("body").append($game);
		});
	};

	mlb.prototype.parseHighlights = function (response) {
		var self = this;

		var $html = $(response);
		var $highlights = $html.find("highlights");

		$highlights.each(function () {
			var id = $(this).attr("game_pk");
			self._highlightsData[id] = $(this);
		});
	};

	window.Mlb = mlb;

})();
