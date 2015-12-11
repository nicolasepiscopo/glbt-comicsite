(function(){
	app.controller('MyAccountController', controller);
	function controller($scope, SessionService, SecurityService, CommentFactory){
		if(SecurityService.isUser()){
			$scope.comments = CommentFactory.find().filter(function(comment){
				return (comment.user.id==SessionService.get('user').id);
			});
		}
	}
})();