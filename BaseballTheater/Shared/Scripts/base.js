jQuery(function ($) {

	var picker = new Pikaday({
		field: $('#calendarpicker')[0],
		format: 'MMM DD, YYYY',
		onSelect: function(date)
		{
			var dateText = moment(date).format("YYYYMMDD");
			window.location = "/" + dateText;
		}
	});

	$(".fa-calendar").on("click", function() {
		picker.show();
	});

	if (!Modernizr.touch)
	{
		$("video").on("click", function() {
			$("video").not($(this)).each(function() {
				$(this)[0].pause();
			});

			var video = $(this)[0];
			video.paused ? video.play() : video.pause();
		});
	}

	$("#favorite-team").on("change", function () {
		var val = $(this).val();

		document.cookie = "favoriteteam=" + val + "; expires=Fri, 31 Dec 9999 23:59:59 GMT;";

		location.search = Date.now();
	});

	$("header .expand-links").on("click", function() {
		$("header").toggleClass("expanded");
	});
});