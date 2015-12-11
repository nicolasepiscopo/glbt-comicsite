(function(){
	app.directive('submit', directive);
	function directive(){
		return {
			restrict : 'E',
			templateUrl : 'app/partials/components/submit.html',
			link : function(scope, element, attrs){
				scope.content=attrs.content;
			}
		}
	}
})();