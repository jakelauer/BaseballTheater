jQuery(function ($) {
	var favoriteteam = Cookies.get("favoriteteam").split(",");

	for (var i = 0; i < favoriteteam.length; i++)
	{
		var team = favoriteteam[i];
		var $games = $(".game-summary[data-homecode=" + team + "], .game-summary[data-awaycode=" + team + "]");
		$(".leagues").prepend($games);
	}

	$("#favorite-team").val(favoriteteam);
});