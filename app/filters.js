(function(){
	app.filter('range', filter);
	function filter(){
		return function(input, total) {
			total = parseInt(total);

			for (var i=0; i<total; i++) {
				input.push(i);
			}
			return input;
		}
	}
})();