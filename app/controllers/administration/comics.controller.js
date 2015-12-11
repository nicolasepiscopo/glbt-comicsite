(function(){
	app.controller('AdministrationComicsController', controller);
	function controller($scope, SessionService, ComicFactory, GenreFactory, ToastService){
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
	}
})();