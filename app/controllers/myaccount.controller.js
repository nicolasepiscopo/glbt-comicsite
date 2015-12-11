(function(){
	app.controller('MyAccountController', controller);
	function controller($scope, SessionService, CommentFactory){
		if(SessionService.get('user')){
			$scope.comments = CommentFactory.find().filter(function(comment){
				return (comment.user.id==SessionService.get('user').id);
			});
		}
	}
})();