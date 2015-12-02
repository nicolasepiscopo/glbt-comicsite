app
.controller('BaseController', function($scope, SessionService){
	$scope.authUser = (SessionService.get('user'))? SessionService.get('user') : false;
	$scope.isAuthenticated = ($scope.authUser!=false);
	$scope.isAdmin = ($scope.authUser.username=="admin");
	$scope.openModal = function(modalId){
		$('#'+modalId).openModal();
	}
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
})
.controller('AdministrationUsersController', function($scope, UserFactory, ToastService){
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
			ToastService.show("User created!");
		}else{
			//Creating user
			UserFactory.update(user);
			ToastService.show("User updated!");
		}
	}
	$scope.remove = function(id){
		//Remove user
		UserFactory.remove(id);
		ToastService.show("User removed!");
		$scope.users = UserFactory.find();
	}
})
.controller('AdministrationComicsController', function($scope, ComicFactory, ToastService){
	$scope.comics = ComicFactory.find();
	$scope.cleanForm = function(){
		$scope.comic = {};
	}; 
	$scope.edit = function(id){
		$scope.comic = ComicFactory.find(function(comic){
			return comic.id==id;
		});
	}
	$scope.save = function(id){
		var comic = $scope.comic;
		if(comic.id){
			//Updating comic
			comic.id = id;
			ComicFactory.update(comic);
		}else{
			//Creating comic
			ComicFactory.update(comic);
		}
	}
	$scope.remove = function(id){
		//Remove comic
		ComicFactory.remove(id);
		ToastService.show("Comic removed!");
		$scope.comics = ComicFactory.find();
	}
})
.controller('AdministrationGenresController', function($scope, GenreFactory, ToastService){
	$scope.genres = GenreFactory.find();
	$scope.cleanForm = function(){
		$scope.genre = {};
	}; 
	$scope.edit = function(id){
		$scope.genre = GenreFactory.find(function(genre){
			return genre.id==id;
		});
	}
	$scope.save = function(id){
		var genre = $scope.genre;
		if(genre.id){
			//Updating genre
			genre.id = id;
			GenreFactory.update(genre);
		}else{
			//Creating genre
			GenreFactory.update(genre);
		}
		$scope.user = {};
	}
	$scope.remove = function(id){
		//Remove genre
		GenreFactory.remove(id);
		ToastService.show("Genre removed!");
		$scope.genres = GenreFactory.find();
	}
});