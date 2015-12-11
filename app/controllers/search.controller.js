(function(){
	app.controller('SearchController', controller);
	function controller($scope, $routeParams, ComicFactory){
		$scope.query = $routeParams.query;
		$scope.$watch('query', function(){	
			$scope.results = ComicFactory.find().filter(function(comic){
				return (comic.title.toLowerCase().indexOf($scope.query.toLowerCase())!=-1);
			});
		});
	}
})();