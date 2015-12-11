(function(){
	app.controller('AdministrationCopiesController', controller); 
	function controller($scope, ToastService, CopyFactory, NumberFactory, CharacterFactory, EditionFactory, ComicFactory, SessionService){
		var user = SessionService.get('user');
		if(user && (user.role == "admin")){
			$scope.comics = ComicFactory.find();
			$scope.copies = CopyFactory.find();
			$scope.editions = [];
			$scope.numbers = [];
			$scope.currentCopy = {};
			$scope.$watch('currentCopy.comic', function(){
				if($scope.currentCopy.comic){
					var comicId = $scope.currentCopy.comic.id;
					$scope.editions = EditionFactory.find().filter(function(edition){
						return edition.comic.id==comicId;
					});	
				}			
			});
			$scope.$watch('currentCopy.edition', function(){
				if($scope.currentCopy.edition){
					var editionId = $scope.currentCopy.edition.id;
					$scope.numbers = NumberFactory.find().filter(function(number){
						return number.edition.id==editionId;
					});	
				}			
			});
			$scope.cleanForm = function(){
				$scope.currentCopy = {};
			}; 
			$scope.edit = function(id){
				$scope.currentCopy = {};
				$scope.currentCopy = CopyFactory.find(function(copy){
					return copy.id==id;
				});
				var comicId = $scope.currentCopy.comic.id;
				$scope.editions = EditionFactory.find().filter(function(edition){
					return edition.comic.id==comicId;
				});
				var editionId = $scope.currentCopy.edition.id;
				$scope.numbers = NumberFactory.find().filter(function(number){
					return number.edition.id==editionId;
				});
			}
			$scope.save = function(id){
				var copy = JSON.parse(JSON.stringify($scope.currentCopy)); 
				if(copy.id){
					//Updating copy
					copy.id = id;
					if(copy.available){
						copy.borrowedBy = null;
						copy.deadline = null;
						console.log(copy);
					}
					CopyFactory.update(copy);
					ToastService.show("Copy updated!");
				}else{
					//Creating copy
					var total = copy.quantity;
					copy.quantity = 1;
					for(var i=0;i<total;i++){
						copy.available = true;
						CopyFactory.add(copy);
						copy = JSON.parse(JSON.stringify($scope.currentCopy));
					}
					ToastService.show("Copy added!");
				}
				ToastService.show("Changes saved!");
				$scope.copies = CopyFactory.find();
				$scope.currentCopy = {};
			}
			$scope.remove = function(id){
				//Remove copy
				CopyFactory.remove(id);
				ToastService.show("Copy removed!");
				$scope.copies = CopyFactory.find();
			}
		}
	}
})();