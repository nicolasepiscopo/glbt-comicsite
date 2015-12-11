(function(){
	app.controller('AdministrationNewsController', controller); 
	function controller($scope, ToastService, SecurityService, NewsFactory, ComicFactory, SessionService){
		if(SecurityService.isAdministrator()){
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
	}
})();