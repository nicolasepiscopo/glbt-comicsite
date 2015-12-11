(function(){
	app.controller('BaseController', controller);

	function controller($scope, SessionService){
		$scope.authUser = (SessionService.get('user'))? SessionService.get('user') : false;
		$scope.isAuthenticated = (SessionService.get('user')!=undefined)&&((SessionService.get('user')!=false));
		$scope.isAdmin = ($scope.authUser.role=="admin");
		$scope.openModal = function(modalId){
			$('#'+modalId).openModal();
		};
		$scope.closeModal = function(modalId){
			$('#'+modalId).closeModal();
		};
	}
})();