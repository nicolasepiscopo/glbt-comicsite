(function(){
	app.controller('SignUpController', controller)
	function controller($scope, SessionService, SecurityService, UserFactory, ToastService, SignUpValidator){
		if(!SecurityService.isUser()){
			$scope.register = function(){
				if(!$scope.$parent.authUser){
					var validation = SignUpValidator.runValidation($scope);
					if(validation.isValid){
						var user = $scope.user;		
						console.log(user);
						UserFactory.add(user);
						$scope.user = {};
						$scope.validation = {};
					}
					validation.messages.forEach(function(msg){
						ToastService.show(msg);
					});
				}
				return false;
			}
		}
	}
})();