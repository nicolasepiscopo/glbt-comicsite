(function(){
	app.controller('NumberController', controller);
	
	function controller($scope, $routeParams, SecurityService, LoanHistoryFactory, CopyFactory, EditionFactory, NumberFactory, SessionService){
		var id = $routeParams.id;
		$scope.comic = EditionFactory.find().filter(function(edition){
			return edition.id==id;
		})[0].comic;
		$scope.numbers = NumberFactory.find().filter(function(number){
			return number.edition.id == id;
		});
		$scope.getAvailableCopies = function(id){
			return CopyFactory.find().filter(function(copy){
				return ((copy.number.id == id)&&(copy.available));
			});
		};
		$scope.getBorrowedCopies = function(id){
			return CopyFactory.find().filter(function(copy){
				return ((copy.number.id == id)&&(!copy.available));
			});
		};
		$scope.canBorrow = function(id){			
			var borrowedYet = CopyFactory.find().filter(function(copy){
				return ((copy.borrowedBy)&&(copy.borrowedBy.id==SessionService.get('user').id)&&(copy.number.id==id));
			}).length;
			var availableCopy = CopyFactory.find().filter(function(copy){
				return ((copy.number.id == id)&&(copy.available));
			}).length;
			return !borrowedYet&&availableCopy&&(SessionService.get('user')!=false)&&(SessionService.get('user')!=null)&&(SessionService.get('user')!=undefined);
		}
		if(SecurityService.isUser()){
			$scope.borrow = function(id){
				var copy = CopyFactory.find().filter(function(copy){
					return ((copy.number.id == id)&&(copy.available));
				});
				if(copy.length){
					var copy = copy[0];
					copy.available = false;
					copy.borrowedBy = SessionService.get('user');
					copy.deadline = new Date((new Date()).getTime() + (7 * 86400000));
					CopyFactory.update(copy);
					var history = {
						copy : copy,
						deadline : copy.deadline,
						borrowedBy : copy.borrowedBy
					};
					LoanHistoryFactory.add(history);				
					$scope.numbers = NumberFactory.find().filter(function(number){
						return number.edition.id == id;
					});
				}
			};
		}
	}
})();