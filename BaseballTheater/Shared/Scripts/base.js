jQuery(function ($) {


	$(".calendar .fa").on("click", function() {
		$("#datepicker-wrapper").toggle();
	});

	$("html, body").on("click", function(e) {
		if (!$(e.target).closest(".calendar").length)
		{
			$("#datepicker-wrapper").hide();
		}	
	});

	$("#datepicker").datepicker({
		dateFormat: "yymmdd",
		onSelect: function(dateText, inst)
		{
			window.location = "/" + dateText;
		}
	});
});