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

	$("video").on("click", function () {
		$("video").not($(this)).each(function() {
			$(this)[0].pause();
		});

		var video = $(this)[0];
		video.paused ? video.play() : video.pause();
	});
});