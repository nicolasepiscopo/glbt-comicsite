(function(){
	app.controller('SidebarController', controller);
	function controller($scope, $location, ComicFactory){
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
	}
})();