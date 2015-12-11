(function(){
	app.controller('SecurityController', controller);
	function controller($scope, $window, $location, SecurityService, UserFactory, ToastService, SignInValidator,SessionService){
		if(!SecurityService.isUser()){
			$scope.login = function(){
				var validation = SignInValidator.runValidation($scope);
				if(validation.isValid){
					var user = UserFactory.find(function(user){
						return (user.username == $scope.user.username)&&(user.password == $scope.user.password);
					});
					//Initialize session
					SessionService.set('user', user);
					$scope.$parent.authUser = user;
					$scope.$parent.isAuthenticated = true;
					$scope.$parent.isAdmin = (user.role=="admin");
					validation.messages.forEach(function(msg){
						ToastService.show(msg);
					});
					$('.modal').closeModal();
					$window.location.href=$location.absUrl().split("#!")[0];
				}
				validation.messages.forEach(function(msg){
					ToastService.show(msg);
				});
			}
		}else{
			$scope.logout = function(){
				SessionService.set('user', false);
				$scope.$parent.authUser = false;
				$scope.$parent.isAuthenticated = false;
				$scope.$parent.isAdmin = false;	
				ToastService.show("See you later!");
				$window.location.href=$location.absUrl().split("#!")[0];
			}
		}
	}
})();