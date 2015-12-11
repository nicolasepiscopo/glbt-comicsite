(function(){
	app.controller('AdministrationGenresController', controller); 
	function controller($scope, SessionService, SecurityService, GenreFactory, ToastService){
		if(SecurityService.isAdministrator()){
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
	}
})();