app
.controller('BaseController', function($scope, SessionService){
	$scope.authUser = (SessionService.get('user'))? SessionService.get('user') : false;
	$scope.isAuthenticated = ($scope.authUser!=false);
	$scope.isAdmin = ($scope.authUser.username=="admin");
})
.controller('MainController', function($scope){

})
.controller('SignUpController', function($scope, UserFactory, ToastService, SignUpValidator){
	$scope.register = function(){
		if(!$scope.$parent.authUser){
			var validation = SignUpValidator.runValidation($scope);
			if(validation.isValid){
				var user = $scope.user;		
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
})
.controller('SecurityController', function($scope, $window, UserFactory, ToastService, SignInValidator,SessionService){
	$scope.login = function(){
		var validation = SignInValidator.runValidation($scope);
		if(validation.isValid){
			var user = UserFactory.find(function(user){
				return user.username == $scope.user.username;
			});
			//Initialize session
			SessionService.set('user', user);
			$scope.$parent.authUser = user;
		}
		validation.messages.forEach(function(msg){
			ToastService.show(msg);
		});
		$window.location.href = "/";
	}
	$scope.logout = function(){
		SessionService.set('user', false);
		$scope.$parent.authUser = false;
		ToastService.show("See you later!");
		$window.location.href = "/";
	}
});