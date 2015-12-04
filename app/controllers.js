app
.controller('BaseController', function($scope, SessionService){
	$scope.authUser = (SessionService.get('user'))? SessionService.get('user') : false;
	$scope.isAuthenticated = (SessionService.get('user')!=false);
	console.log($scope.isAuthenticated);
	$scope.isAdmin = ($scope.authUser.role=="admin");
	$scope.openModal = function(modalId){
		$('#'+modalId).openModal();
	};
	$scope.closeModal = function(modalId){
		$('#'+modalId).closeModal();
	};
})
.controller('MainController', function($scope, GenreFactory, ComicFactory){
	$scope.genres = GenreFactory.find();
	$scope.countComics = function(id){
		return ComicFactory.find().filter(function(comic){
			return comic.genre.id==id;
		}).length;
	}
})
.controller('SignUpController', function($scope, SessionService, UserFactory, ToastService, SignUpValidator){
	if(!SessionService.get('user')){
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
	}
})
.controller('SecurityController', function($scope, $window, UserFactory, ToastService, SignInValidator,SessionService){
	if(!SessionService.get('user')){
		$scope.login = function(){
			var validation = SignInValidator.runValidation($scope);
			if(validation.isValid){
				var user = UserFactory.find(function(user){
					return user.username == $scope.user.username;
				});
				//Initialize session
				SessionService.set('user', user);
				$scope.$parent.authUser = user;
				validation.messages.forEach(function(msg){
					ToastService.show(msg);
				});
				$window.location.href = "/";
			}
			validation.messages.forEach(function(msg){
				ToastService.show(msg);
			});
		}
	}
	if(SessionService.get('user')){
		$scope.logout = function(){
			SessionService.set('user', false);
			$scope.$parent.authUser = false;
			ToastService.show("See you later!");
			$window.location.href = "/";
		}
	}
})
.controller('AdministrationUsersController', function($scope, SessionService, UserFactory, ToastService){
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
})
.controller('AdministrationComicsController', function($scope, SessionService, ComicFactory, GenreFactory, ToastService){
	if(SessionService.get('user')&&(SessionService.get('user').role=="admin")){
		$scope.comics = ComicFactory.find();
		$scope.genres = GenreFactory.find();
		$scope.getGenre = function(id){
			return GenreFactory.find(function(genre){
				return (genre.id==id);
			});
		};
		$scope.cleanForm = function(){
			$scope.comic = {};
			$scope.comic.videos = [];
		}; 
		$scope.edit = function(id){
			$scope.comic = ComicFactory.find(function(comic){
				return comic.id==id;
			});
			if(!$scope.comic.videos)
				$scope.comic.videos = [];
		}
		$scope.save = function(id){
			var comic = $scope.comic;
			if(comic.id){
				//Updating comic
				comic.id = id;
				ComicFactory.update(comic);
				ToastService.show("Comic updated!");
			}else{
				//Creating comic
				ComicFactory.add(comic);
				ToastService.show("Comic created!");
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
		$scope.removeVideo = function(url){
			var whereItIs = $scope.comic.videos.indexOf(url);
			if(whereItIs!=-1){
				$scope.comic.videos.splice(whereItIs,1);
				ToastService.show("Video removed!");
			}
		}
		$scope.addVideo = function(url){
			if($('#newVideo')[0].checkValidity()){
				var repeated = $scope.comic.videos.indexOf(url);
				if(repeated==-1){
					$scope.comic.videos.push(url);
					ToastService.show("Video added!");
				}else{
					ToastService.show("That video already exists for this comic!");
				}
				$scope.newVideo = "";
			}else{
				ToastService.show("That video URL is not valid.");
			}
		}
		$scope.cleanForm();
	}
})
.controller('AdministrationGenresController', function($scope, SessionService, GenreFactory, ToastService){
	if(SessionService.get('user')&&(SessionService.get('user').role=="admin")){
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
	}
})
.controller('SidebarController', function($scope, $location, ComicFactory){
	$scope.search = function(){
		$location.path("/search/"+$scope.query);
	};
	$scope.showComic = function(id){
		$location.path("/comic/"+id);
	}
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
.controller('ComicController', function($scope, $sce, $routeParams, CommentFactory, SessionService, VisitFactory, ComicFactory, GenreFactory){
	var id = $routeParams.id;

	$scope.comic = ComicFactory.find(function(comic){
		return comic.id==id;
	});

	$scope.comments = CommentFactory.find().filter(function(comment){
		return comment.comic.id==id;
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
	$scope.comment = {};
	$scope.addComment = function(){
		$scope.comment.user = SessionService.get('user');
		$scope.comment.comic = $scope.comic;
		CommentFactory.add($scope.comment);
		$scope.comments = CommentFactory.find().filter(function(comment){
			return comment.comic.id==id;
		});
		$scope.comment = {};
	}

	$scope.getVideoUrl = function(url){
		return $sce.trustAsResourceUrl("//www.youtube.com/embed/" + url.split('watch?v=')[1] + "?rel=0");
	}
})
.controller('RatingController', function($scope, QualificationFactory, ComicFactory, SessionService){
	var id = $scope.$parent.comic.id;
	if(SessionService.get('user')){
		/* User rating shown at start */
		var rating = QualificationFactory.find(function(q){
			return (q.user == SessionService.get('user').id)&&(q.comic==id);
		});
		if(rating)
			$scope.rating = rating.stars;			

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
	}

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

	/* Runs at start */
	$scope.calculateRating();
})
.controller('SearchController', function($scope, $routeParams, ComicFactory){
	$scope.query = $routeParams.query;
	$scope.results = ComicFactory.find().filter(function(comic){
		return (comic.title.toLowerCase().indexOf($scope.query.toLowerCase())!=-1);
	});
})
.controller('ComicsController', function($scope, $routeParams, ComicFactory){
	if($routeParams.id){
		$scope.results = ComicFactory.find().filter(function(comic){
			return comic.genre.id==$routeParams.id;
		});
	}else{	
		$scope.results = ComicFactory.find();
	}
})
.controller('MyAccountController', function($scope, SessionService, CommentFactory){
	if(SessionService.get('user')){
		$scope.comments = CommentFactory.find().filter(function(comment){
			return (comment.user.id==SessionService.get('user').id);
		});
	}
});