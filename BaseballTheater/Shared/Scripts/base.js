jQuery(function ($) {


	$(".calendar .fa").on("click", function() {
		$("#datepicker-wrapper").toggle();
	});

	$("#datepicker").datepicker({
		dateFormat: "yymmdd",
		onSelect: function(dateText, inst)
		{
			window.location = "/" + dateText;
		}
	});
});