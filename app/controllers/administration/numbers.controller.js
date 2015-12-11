(function(){
	app.controller('AdministrationNumbersController', controller);
	function controller($scope, ToastService, NumberFactory, CharacterFactory, EditionFactory, ComicFactory, SessionService){
		var user = SessionService.get('user');
		if(user && (user.role == "admin")){
			$scope.comics = ComicFactory.find();
			$scope.numbers = NumberFactory.find();
			$scope.editions = [];
			$scope.currentNumber = {};
			$scope.$watch('currentNumber.comic', function(){
				if($scope.currentNumber.comic){
					var comicId = $scope.currentNumber.comic.id;
					$scope.editions = EditionFactory.find().filter(function(edition){
						return edition.comic.id==comicId;
					});				
					$scope.characters = CharacterFactory.find().filter(function(character){
						return character.comic.id==comicId;
					}); 
				}			
			});
			$scope.cleanForm = function(){
				$scope.currentNumber = {};
				$scope.currentNumber.characters = [];
			}; 
			$scope.edit = function(id){
				$scope.currentNumber = NumberFactory.find(function(number){
					return number.id==id;
				});
				var comicId = $scope.currentNumber.comic.id;
				$scope.editions = EditionFactory.find().filter(function(edition){
					return edition.comic.id==comicId;
				});
				$scope.characters = CharacterFactory.find().filter(function(character){
					return character.comic.id==comicId;
				});
				if(!$scope.currentNumber.characters)
					$scope.currentNumber.characters = [];
			}
			$scope.save = function(id){
				var number = $scope.currentNumber;
				if(number.id){
					//Updating number
					number.id = id;
					NumberFactory.update(number);
					ToastService.show("Number updated!");
				}else{
					//Creating number
					NumberFactory.add(number);
					ToastService.show("Number created!");
				}
				ToastService.show("Changes saved!");
				$scope.numbers = NumberFactory.find();
				$scope.currentNumber = {};
			}
			$scope.remove = function(id){
				//Remove number
				NumberFactory.remove(id);
				ToastService.show("Number removed!");
				$scope.numbers = NumberFactory.find();
			}
			$scope.removeCharacter = function(selectedCharacter){
				$scope.currentNumber.characters = $scope.currentNumber.characters.filter(function(character){
					return character.id!=selectedCharacter.id;
				});
				ToastService.show("Character removed!");
			}
			$scope.addCharacter = function(selectedCharacter){
				$scope.currentNumber.characters = $scope.currentNumber.characters.filter(function(character){
					return character.id!=selectedCharacter.id;
				});
				$scope.currentNumber.characters.push(selectedCharacter);
				ToastService.show("Character added!");
				$scope.newCharacter = {};
			}
		}
	}
})();