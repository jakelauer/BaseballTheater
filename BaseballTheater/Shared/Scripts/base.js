jQuery(function ($) {
	var requestedDateObj = window.SERVER_VARS.RequestedDate;
	var dateString = requestedDateObj.Year + "-" + requestedDateObj.Month + "-" + requestedDateObj.Day + " EST";
	var requestedDate = new Date(dateString);
	var mlb = new Mlb(requestedDate);
	//mlb.init();
});