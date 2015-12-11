(function(){
	app.service("SecurityService", service);
	function service(SessionService){		
		this.isAdministrator = function(){
			var user = SessionService.get('user');
			return (user&&(user.role=='admin'));
			;
		};
		this.isUser = function(){
			var user = SessionService.get('user');
			return ((user!=null)&&(user!=undefined)&&(user!=false));
		};
	}
})();