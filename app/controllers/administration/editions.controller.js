(function(){
	app.controller('AdministrationEditionsController', controller);
	function controller($scope, $routeParams, ToastService, ComicFactory, EditionFactory, SessionService){
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
	}
})();