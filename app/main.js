angular.module('ComicStore', ['ngRoute']);

//Set hashbang
angular.module('ComicStore').config(function($locationProvider){
	$locationProvider.hashPrefix("!");
});

//Routing
angular.module('ComicStore').config(function($routeProvider){
	$routeProvider
	.when('/',{
		controller  : 'MainController',
		templateUrl : 'app/partials/main.html'
	})
	.when('/sign-up',{
		controller  : 'SignUpController',
		templateUrl : 'app/partials/sign-up.html'
	})
	.when('/404',{
		templateUrl : 'app/partials/404.html'
	})
	.otherwise({
		redirectTo : '/404'
	});
});