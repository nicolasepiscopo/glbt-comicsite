(function(){
	app.controller('AdministrationUsersController', controller); 
	function controller($scope, SessionService, UserFactory, ToastService){
		if(SessionService.get('user')&&(SessionService.get('user').role=="admin")){
			$scope.users = UserFactory.find();
			$scope.cleanForm = function(){
				$scope.user = {};
			}; 
			$scope.edit = function(id){
				$scope.user = UserFactory.find(function(user){
					return user.id==id;
				});
			}
			$scope.save = function(id){
				var user = $scope.user;
				if(user.id){
					//Updating user
					user.id = id;
					UserFactory.update(user);
					ToastService.show("User updated!");
				}else{
					//Creating user
					UserFactory.add(user);
					ToastService.show("User created!");
				}
				$scope.users = UserFactory.find();
				$scope.user = {};
			}
			$scope.remove = function(id){
				//Remove user
				UserFactory.remove(id);
				ToastService.show("User removed!");
				$scope.users = UserFactory.find();
			}
		}
	}
})();