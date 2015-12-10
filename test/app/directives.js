app.
directive('breadcrumb', function(){
	return {
		restrict : 'E',
		templateUrl : 'app/partials/components/breadcrumb.html',
		link : function(scope, element, attrs){
			scope.links = JSON.parse(attrs.ngLinks);
		}
	}
}).
directive('submit', function(){
	return {
		restrict : 'E',
		templateUrl : 'app/partials/components/submit.html',
		link : function(scope, element, attrs){
			scope.content=attrs.content;
		}
	}
});