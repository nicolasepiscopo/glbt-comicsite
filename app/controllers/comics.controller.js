(function(){
	app.controller('ComicsController', controller);
	function controller($scope, $routeParams, ComicFactory){
		if($routeParams.id){
			$scope.results = ComicFactory.find().filter(function(comic){
				return comic.genre.id==$routeParams.id;
			});
		}else{	
			$scope.results = ComicFactory.find();
		}
	}
})();