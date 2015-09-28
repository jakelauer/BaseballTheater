(function() {
	var home = function () {

	};

	home.prototype.init = function () {
		this.interactions();
	};

	home.prototype.interactions = function() {
		$("#blog-name").on("submit", function (e) {
			e.preventDefault();

			var value = $.trim($("input", this).val());
			window.location = "/Blog/" + value;

			return false;
		});
	};

	Vanilla.Home = home;
})();

jQuery(function () {
	var home = new Vanilla.Home();
	home.init();
});