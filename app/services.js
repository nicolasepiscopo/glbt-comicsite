app
.service("ToastService", function(){
	this.show = function(message){
		Materialize.toast(message, 5000);
	};
})
.service("SessionService", function(){
	this.get = function(sessionName){
		return JSON.parse(localStorage.getItem("session_"+sessionName));
	};
	this.set = function(sessionName, value){
		localStorage.setItem("session_"+sessionName, JSON.stringify(value));
	};
});