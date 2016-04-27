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
});