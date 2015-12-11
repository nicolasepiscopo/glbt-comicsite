(function(){
	app.controller('AdministrationCharactersController', controller);
	function controller($scope, SecurityService, ToastService, CharacterFactory, ComicFactory, SessionService){
		if(SecurityService.isAdministrator()){
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
	}
})();