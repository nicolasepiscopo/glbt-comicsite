app
.controller('BaseController', function($scope, SessionService){
	$scope.authUser = (SessionService.get('user'))? SessionService.get('user') : false;
	$scope.isAuthenticated = (SessionService.get('user')!=false);
	$scope.isAdmin = ($scope.authUser.role=="admin");
	$scope.openModal = function(modalId){
		$('#'+modalId).openModal();
	};
	$scope.closeModal = function(modalId){
		$('#'+modalId).closeModal();
	};
})
.controller('MainController', function($scope, $sce, GenreFactory, NewsFactory, ComicFactory, CharacterFactory){
	$scope.genres = GenreFactory.find();
	$scope.characters = CharacterFactory.find();
	$scope.news = NewsFactory.find();
	$scope.countComicsByGenre = function(id){
		return ComicFactory.find().filter(function(comic){
			return comic.genre.id==id;
		}).length;
	}
	$scope.getVideoUrl = function(url){
		return $sce.trustAsResourceUrl("//www.youtube.com/embed/" + url.split('watch?v=')[1] + "?rel=0");
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
				$window.location.href="/";
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
			$scope.$parent.isAuthenticated = false;
			$scope.$parent.isAdmin = false;	
			ToastService.show("See you later!");
			$window.location.href="/";
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
.controller('ComicController', function($scope, $sce, $routeParams, EditionFactory, NumberFactory, NewsFactory, CharacterFactory, CommentFactory, SessionService, VisitFactory, ComicFactory, GenreFactory){
	var id = $routeParams.id;

	$scope.comic = ComicFactory.find(function(comic){
		return comic.id==id;
	});

	$scope.comments = CommentFactory.find().filter(function(comment){
		return comment.comic.id==id;
	});

	$scope.characters = CharacterFactory.find().filter(function(character){
		return character.comic.id==id;
	});

	$scope.news = NewsFactory.find().filter(function(news){
		return news.comic.id==id;
	});

	$scope.editions = EditionFactory.find().filter(function(edition){
		return edition.comic.id==id;
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

	$scope.countNumbersByEdition = function(id){
		return NumberFactory.find().filter(function(number){
			return number.edition.id==id;
		}).length;
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
})
.controller('AdministrationEditionsController', function($scope, $routeParams, ToastService, ComicFactory, EditionFactory, SessionService){
	var user = SessionService.get('user');
	var id = $routeParams.id;
	if(user && (user.role == "admin")){
		$scope.editions = EditionFactory.find();
		$scope.comics = ComicFactory.find();
		$scope.cleanForm = function(){
			$scope.edition = {};
		}; 
		$scope.edit = function(id){
			$scope.edition = EditionFactory.find(function(edition){
				return edition.id==id;
			});
		}
		$scope.save = function(id){
			var edition = $scope.edition;
			if(edition.id){
				//Updating edition
				edition.id = id;
				EditionFactory.update(edition);
				ToastService.show("Edition updated!");
			}else{
				//Creating edition
				EditionFactory.add(edition);
				ToastService.show("Edition created!");
			}
			ToastService.show("Changes saved!");
			$scope.editions = EditionFactory.find();
			$scope.edition = {};
		}
		$scope.remove = function(id){
			//Remove edition
			EditionFactory.remove(id);
			ToastService.show("Edition removed!");
			$scope.editions = EditionFactory.find();
		}
	}
})
.controller('AdministrationNumbersController', function($scope, ToastService, NumberFactory, CharacterFactory, EditionFactory, ComicFactory, SessionService){
	var user = SessionService.get('user');
	if(user && (user.role == "admin")){
		$scope.comics = ComicFactory.find();
		$scope.numbers = NumberFactory.find();
		$scope.editions = [];
		$scope.currentNumber = {};
		$scope.$watch('currentNumber.comic', function(){
			if($scope.currentNumber.comic){
				var comicId = $scope.currentNumber.comic.id;
				$scope.editions = EditionFactory.find().filter(function(edition){
					return edition.comic.id==comicId;
				});				
				$scope.characters = CharacterFactory.find().filter(function(character){
					return character.comic.id==comicId;
				}); 
			}			
		});
		$scope.cleanForm = function(){
			$scope.currentNumber = {};
			$scope.currentNumber.characters = [];
		}; 
		$scope.edit = function(id){
			$scope.currentNumber = NumberFactory.find(function(number){
				return number.id==id;
			});
			var comicId = $scope.currentNumber.comic.id;
			$scope.editions = EditionFactory.find().filter(function(edition){
				return edition.comic.id==comicId;
			});
			$scope.characters = CharacterFactory.find().filter(function(character){
				return character.comic.id==comicId;
			});
			if(!$scope.currentNumber.characters)
				$scope.currentNumber.characters = [];
		}
		$scope.save = function(id){
			var number = $scope.currentNumber;
			if(number.id){
				//Updating number
				number.id = id;
				NumberFactory.update(number);
				ToastService.show("Number updated!");
			}else{
				//Creating number
				NumberFactory.add(number);
				ToastService.show("Number created!");
			}
			ToastService.show("Changes saved!");
			$scope.numbers = NumberFactory.find();
			$scope.currentNumber = {};
		}
		$scope.remove = function(id){
			//Remove number
			NumberFactory.remove(id);
			ToastService.show("Number removed!");
			$scope.numbers = NumberFactory.find();
		}
		$scope.removeCharacter = function(selectedCharacter){
			$scope.currentNumber.characters = $scope.currentNumber.characters.filter(function(character){
				return character.id!=selectedCharacter.id;
			});
			ToastService.show("Character removed!");
		}
		$scope.addCharacter = function(selectedCharacter){
			$scope.currentNumber.characters = $scope.currentNumber.characters.filter(function(character){
				return character.id!=selectedCharacter.id;
			});
			$scope.currentNumber.characters.push(selectedCharacter);
			ToastService.show("Character added!");
			$scope.newCharacter = {};
		}
	}
})
.controller('AdministrationCopiesController', function($scope, ToastService, CopyFactory, NumberFactory, CharacterFactory, EditionFactory, ComicFactory, SessionService){
	var user = SessionService.get('user');
	if(user && (user.role == "admin")){
		$scope.comics = ComicFactory.find();
		$scope.copies = CopyFactory.find();
		$scope.editions = [];
		$scope.numbers = [];
		$scope.currentCopy = {};
		$scope.$watch('currentCopy.comic', function(){
			if($scope.currentCopy.comic){
				var comicId = $scope.currentCopy.comic.id;
				$scope.editions = EditionFactory.find().filter(function(edition){
					return edition.comic.id==comicId;
				});	
			}			
		});
		$scope.$watch('currentCopy.edition', function(){
			if($scope.currentCopy.edition){
				var editionId = $scope.currentCopy.edition.id;
				$scope.numbers = NumberFactory.find().filter(function(number){
					return number.edition.id==editionId;
				});	
			}			
		});
		$scope.cleanForm = function(){
			$scope.currentCopy = {};
		}; 
		$scope.edit = function(id){
			$scope.currentCopy = {};
			$scope.currentCopy = CopyFactory.find(function(copy){
				return copy.id==id;
			});
			var comicId = $scope.currentCopy.comic.id;
			$scope.editions = EditionFactory.find().filter(function(edition){
				return edition.comic.id==comicId;
			});
			var editionId = $scope.currentCopy.edition.id;
			$scope.numbers = NumberFactory.find().filter(function(number){
				return number.edition.id==editionId;
			});
		}
		$scope.save = function(id){
			var copy = JSON.parse(JSON.stringify($scope.currentCopy)); 
			if(copy.id){
				//Updating copy
				copy.id = id;
				if(copy.available){
					copy.borrowedBy = null;
					copy.deadline = null;
					console.log(copy);
				}
				CopyFactory.update(copy);
				ToastService.show("Copy updated!");
			}else{
				//Creating copy
				var total = copy.quantity;
				copy.quantity = 1;
				for(var i=0;i<total;i++){
					copy.available = true;
					CopyFactory.add(copy);
					copy = JSON.parse(JSON.stringify($scope.currentCopy));
				}
				ToastService.show("Copy added!");
			}
			ToastService.show("Changes saved!");
			$scope.copies = CopyFactory.find();
			$scope.currentCopy = {};
		}
		$scope.remove = function(id){
			//Remove copy
			CopyFactory.remove(id);
			ToastService.show("Copy removed!");
			$scope.copies = CopyFactory.find();
		}
	}
})
.controller('AdministrationCharactersController', function($scope, ToastService, CharacterFactory, ComicFactory, SessionService){
	var user = SessionService.get('user');
	if(user && (user.role == "admin")){
		$scope.comics = ComicFactory.find();
		$scope.characters = CharacterFactory.find();
		$scope.character = {};
		$scope.cleanForm = function(){
			$scope.character = {};
		}; 
		$scope.edit = function(id){
			$scope.character = CharacterFactory.find(function(character){
				return character.id==id;
			});
		}
		$scope.save = function(id){
			var character = $scope.character;
			if(character.id){
				//Updating character
				character.id = id;
				CharacterFactory.update(character);
				ToastService.show("Character updated!");
			}else{
				//Creating character
				CharacterFactory.add(character);
				ToastService.show("Character created!");
			}
			ToastService.show("Changes saved!");
			$scope.characters = CharacterFactory.find();
			$scope.character = {};
		}
		$scope.remove = function(id){
			//Remove character
			CharacterFactory.remove(id);
			ToastService.show("Character removed!");
			$scope.characters = CharacterFactory.find();
		}
	}
})
.controller('AdministrationNewsController', function($scope, ToastService, NewsFactory, ComicFactory, SessionService){
	var user = SessionService.get('user');
	if(user && (user.role == "admin")){
		$scope.comics = ComicFactory.find();
		$scope.news = NewsFactory.find();
		$scope.currentNew = {};
		$scope.cleanForm = function(){
			$scope.currentNew = {};
		}; 
		$scope.edit = function(id){
			$scope.currentNew = NewsFactory.find(function(character){
				return character.id==id;
			});
		}
		$scope.save = function(id){
			var currentNew = $scope.currentNew;
			if(currentNew.id){
				//Updating character
				currentNew.id = id;
				NewsFactory.update(currentNew);
				ToastService.show("New updated!");
			}else{
				//Creating character
				NewsFactory.add(currentNew);
				ToastService.show("New created!");
			}
			ToastService.show("Changes saved!");
			$scope.news = NewsFactory.find();
			$scope.currentNew = {};
		}
		$scope.remove = function(id){
			//Remove character
			NewsFactory.remove(id);
			ToastService.show("New removed!");
			$scope.news = NewsFactory.find();
		}
	}
})
.controller('LoanController', function($scope, LoanHistoryFactory, CopyFactory, SessionService){
	$scope.borrowedCopiesByMe = CopyFactory.find().filter(function(copy){
		return (copy.borrowedBy)&&(copy.borrowedBy.id==SessionService.get('user').id);
	});
	$scope.loanHistoryByMe = LoanHistoryFactory.find().filter(function(loan){
		return (loan.borrowedBy)&&(loan.borrowedBy.id==SessionService.get('user').id);
	});
})
.controller('NumberController', function($scope, $routeParams, LoanHistoryFactory, CopyFactory, EditionFactory, NumberFactory, SessionService){
	var id = $routeParams.id;
	$scope.comic = EditionFactory.find().filter(function(edition){
		return edition.id==id;
	})[0].comic;
	$scope.numbers = NumberFactory.find().filter(function(number){
		return number.edition.id == id;
	});
	$scope.getAvailableCopies = function(id){
		return CopyFactory.find().filter(function(copy){
			return ((copy.number.id == id)&&(copy.available));
		});
	};
	$scope.getBorrowedCopies = function(id){
		return CopyFactory.find().filter(function(copy){
			return ((copy.number.id == id)&&(!copy.available));
		});
	};
	$scope.canBorrow = function(id){			
		var borrowedYet = CopyFactory.find().filter(function(copy){
			return ((copy.borrowedBy)&&(copy.borrowedBy.id==SessionService.get('user').id)&&(copy.number.id==id));
		}).length;
		var availableCopy = CopyFactory.find().filter(function(copy){
			return ((copy.number.id == id)&&(copy.available));
		}).length;
		return !borrowedYet&&availableCopy&&Session.get('user');
	}
	if(SessionService.get('user')){
		$scope.borrow = function(id){
			var copy = CopyFactory.find().filter(function(copy){
				return ((copy.number.id == id)&&(copy.available));
			});
			if(copy.length){
				var copy = copy[0];
				copy.available = false;
				copy.borrowedBy = SessionService.get('user');
				copy.deadline = new Date((new Date()).getTime() + (7 * 86400000));
				CopyFactory.update(copy);
				var history = {
					copy : copy,
					deadline : copy.deadline,
					borrowedBy : copy.borrowedBy
				};
				LoanHistoryFactory.add(history);				
				$scope.numbers = NumberFactory.find().filter(function(number){
					return number.edition.id == id;
				});
			}
		};
	}
});