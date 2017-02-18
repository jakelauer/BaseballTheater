jQuery(function ($) {

	var picker = new Pikaday({
		field: $('#calendarpicker')[0],
		format: "MMM DD, YYYY",
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
			var video = this;
			setTimeout(function() {
				if (!video.paused)
				{
					video.pause();
				}
			}, 1000 / 60);
		});
	}

	$(".video .play-cover").on("click", function() {
		var $video = $(this).parent();
		var video = $video.find("video")[0];

		video.play();
		$(this).hide();
	});

	$(".video video").on("pause", function() {
		$(this).siblings(".play-cover").show();
	});

	$(".video video").on("play", function () {
		$("video").not($(this)).each(function() {
			this.pause();
		});
		$(this).siblings(".play-cover").hide();
	});

	$("#favorite-team").on("change", function () {
		var val = $(this).val();

		document.cookie = "favoriteteam=" + val + "; expires=Fri, 31 Dec 9999 23:59:59 GMT;";

		location.search = Date.now();
	});

	$("header .expand-links").on("click", function() {
		$("header").toggleClass("expanded");
	});

	if (Cookies.get("hidescores") === "true")
	{
		$("#scoreshidden").attr("checked", "checked");
		$(".score-box").text("▨");
		$(".highlight.recap h2").text("Recap");
	}
	else
	{
		$(".Game .settings").hide();
	}

	$(".highlight.recap h2").addClass("on");

	$("#scoreshidden").on("change", function () {
		var checked = $(this).is(":checked");
		Cookies.set("hidescores", checked, { expires: 999 });
		location.reload();
	});
});