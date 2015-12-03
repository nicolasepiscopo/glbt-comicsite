app
.controller('BaseController', function($scope, SessionService){
	$scope.authUser = (SessionService.get('user'))? SessionService.get('user') : false;
	$scope.isAuthenticated = ($scope.authUser!=false);
	$scope.isAdmin = ($scope.authUser.username=="admin");
	$scope.openModal = function(modalId){
		$('#'+modalId).openModal();
	};
	$scope.closeModal = function(modalId){
		$('#'+modalId).closeModal();
	};
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
})
.controller('AdministrationComicsController', function($scope, ComicFactory, GenreFactory, ToastService){
	$scope.comics = ComicFactory.find();
	$scope.genres = GenreFactory.find();
	$scope.getGenre = function(id){
		return GenreFactory.find(function(genre){
			return (genre.id==id);
		});
	};
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
			ToastService.show("Comic created!");
		}else{
			//Creating comic
			ComicFactory.add(comic);
			ToastService.show("Comic updated!");
		}
		$scope.comics = ComicFactory.find();
		$scope.comic = {};
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
			ToastService.show("Genre updated!");
		}else{
			//Creating genre
			GenreFactory.add(genre);
			ToastService.show("Genre created!");
		}
		ToastService.show("Changes saved!");
		$scope.genres = GenreFactory.find();
		$scope.genre = {};
	}
	$scope.remove = function(id){
		//Remove genre
		GenreFactory.remove(id);
		ToastService.show("Genre removed!");
		$scope.genres = GenreFactory.find();
	}
})
.controller('SidebarController', function($scope, ComicFactory){
	$scope.topRated = ComicFactory.find().sort(function(oneComic, anotherComic){
		if(oneComic.rating>anotherComic.rating)
			return -1;
		else if(oneComic.rating<anotherComic.rating)
			return 1;
		else
			return 0;
	}).slice(0,4);
	$scope.topSearches = ComicFactory.find().sort(function(oneComic, anotherComic){
		if(oneComic.visits>anotherComic.visits)
			return -1;
		else if(oneComic.visits<anotherComic.visits)
			return 1;
		else
			return 0;
	}).slice(0,4);
})
.controller('ComicController', function($scope, $routeParams, SessionService, VisitFactory, ComicFactory, GenreFactory){
	var id = $routeParams.id;

	$scope.comic = ComicFactory.find(function(comic){
		return comic.id==id;
	});

	/* Add a visit if user is authenticated */
	if(SessionService.get('user')){
		var visited = VisitFactory.find(function(v){
			return (v.user==SessionService.get('user').id)&&(v.comic==id);
		});
		if(!visited){
			VisitFactory.add({
				comic : id,
				user : SessionService.get('user').id
			});
			if($scope.comic.visits)
				$scope.comic.visits++;
			else
				$scope.comic.visits = 1;
			ComicFactory.update($scope.comic);
		}
	}

	$scope.getGenre = function(id){
		return GenreFactory.find(function(genre){
			return (genre.id==id);
		});
	};
})
.controller('RatingController', function($scope, QualificationFactory, ComicFactory, SessionService){
	var id = $scope.$parent.comic.id;
	/* User rating shown at start */
	var rating = QualificationFactory.find(function(q){
		return (q.user == SessionService.get('user').id)&&(q.comic==id);
	});
	if(rating)
		$scope.rating = rating.stars;	

	/* Calculate global rating for one comic */
	$scope.calculateRating = function(){		
		var quantity = 0; 
		var total = 0;

		QualificationFactory.find().forEach(function(q){
			if(q.comic==id){
				quantity++;
				total += q.stars;
			}
		});

		$scope.communityRating = Math.ceil(total/quantity);

		/* Update rating */
		if($scope.$parent.comic.rating != $scope.communityRating){
			$scope.$parent.comic.rating = $scope.communityRating;
			ComicFactory.update($scope.$parent.comic);
		}

		$scope.stars = [
			{ name : "1 Star", value : 1 },
			{ name : "2 Stars", value : 2 },
			{ name : "3 Stars", value : 3 },
			{ name : "4 Stars", value : 4 },
			{ name : "5 Stars", value : 5 },
		];
	};

	/* Rate a comic */
	$scope.rate = function(){
		var previousRatingByUser = QualificationFactory.find(function(q){
			return (q.user == SessionService.get('user').id)&&(q.comic==id);
		});
		if(previousRatingByUser){
			//modify qualification
			previousRatingByUser.stars = $scope.rating;
			QualificationFactory.update(previousRatingByUser);
		}else{
			//create qualification
			QualificationFactory.add({
				comic : id,
				user : SessionService.get('user').id,
				stars : $scope.rating
			});
		}
	};

	/* Runs at start */
	$scope.calculateRating();
});