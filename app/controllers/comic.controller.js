(function(){

	app.controller('ComicController', controller);

	function controller($scope, $sce, $routeParams, EditionFactory, NumberFactory, NewsFactory, CharacterFactory, CommentFactory, SessionService, VisitFactory, ComicFactory, GenreFactory){
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
	}
})();
