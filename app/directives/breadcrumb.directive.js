(function(){
	app.directive('breadcrumb', directive);
	function directive(){
		return {
			restrict : 'E',
			templateUrl : 'app/partials/components/breadcrumb.html',
			link : function(scope, element, attrs){
				scope.links = JSON.parse(attrs.ngLinks);
			}
		}
	}
})();