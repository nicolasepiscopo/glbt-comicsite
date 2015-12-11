(function(){
	app.controller('BaseController', controller);

	function controller($scope, SessionService, SecurityService){
		$scope.authUser = (SessionService.get('user'))? SessionService.get('user') : false;
		$scope.isAuthenticated = SecurityService.isUser();
		$scope.isAdmin = SecurityService.isAdministrator();
		$scope.openModal = function(modalId){
			$('#'+modalId).openModal();
		};
		$scope.closeModal = function(modalId){
			$('#'+modalId).closeModal();
		};
		$scope.query;
	}
})();