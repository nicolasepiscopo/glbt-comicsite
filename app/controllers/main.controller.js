(function(){
	app.controller('MainController', controller);
	function controller($scope, $sce, GenreFactory, NewsFactory, ComicFactory, CharacterFactory){
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
	}
})();