angular.module('ComicSite')
.controller('MenuController', function($scope){

})
.controller('MainController', function($scope){

})
.controller('SignUpController', function($scope, User){
	console.log("asdsad111");
	$scope.register = function(){
		console.log("asdsad");
		var user = $scope.user;
		User.add(user);
		console.log(User.find());
		return false;
	}
});