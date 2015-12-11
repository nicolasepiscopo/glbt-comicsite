(function(){
	app.controller('LoanController', controller); 

	function controller($scope, SecurityService, LoanHistoryFactory, CopyFactory, SessionService){
		if(SecurityService.isUser()){
			$scope.borrowedCopiesByMe = CopyFactory.find().filter(function(copy){
				return (copy.borrowedBy)&&(copy.borrowedBy.id==SessionService.get('user').id);
			});
			$scope.loanHistoryByMe = LoanHistoryFactory.find().filter(function(loan){
				return (loan.borrowedBy)&&(loan.borrowedBy.id==SessionService.get('user').id);
			});
		}
	};
})();