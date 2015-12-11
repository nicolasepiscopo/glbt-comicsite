(function(){
	app.service("ToastService", service);
	function service(){
		this.show = function(message){
			Materialize.toast(message, 5000);
		};
	}
})();