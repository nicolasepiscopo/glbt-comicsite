(function(){
	app.service("SessionService", service);
	function service(){
		this.get = function(sessionName){
			return JSON.parse(localStorage.getItem("session_"+sessionName));
		};
		this.set = function(sessionName, value){
			localStorage.setItem("session_"+sessionName, JSON.stringify(value));
		};
	}
})();