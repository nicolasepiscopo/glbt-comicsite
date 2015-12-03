var app = angular.module('ComicStore', ['ngRoute']);

//Set hashbang
app.config(function($locationProvider){
	$locationProvider.hashPrefix("!");
});

//Routing
app.config(function($routeProvider){
	$routeProvider
	.when('/',{
		controller  : 'MainController',
		templateUrl : 'app/partials/main.html'
	})
	.when('/sign-up',{
		controller  : 'SignUpController',
		templateUrl : 'app/partials/sign-up.html'
	})
	.when('/administration',{
		templateUrl : 'app/partials/administration.html'
	})
	.when('/comic/:id',{
		controller : 'ComicController',
		templateUrl : 'app/partials/comic.html'
	})
	.when('/search/:query', {
		controller : 'SearchController',
		templateUrl : 'app/partials/search-results.html'
	})
	.when('/comics', {
		controller : 'ComicsController',
		templateUrl : 'app/partials/comics.html'
	})
	.when('/advanced-search', {
		templateUrl : 'app/partials/advanced-search.html'
	})
	.when('/my-account', {
		controller : 'MyAccountController',
		templateUrl : 'app/partials/my-account.html'
	})
	.when('/comics/genre/:id', {
		controller : 'ComicsController',
		templateUrl : 'app/partials/comics.html'
	})
	.when('/404',{
		templateUrl : 'app/partials/404.html'
	})
	.otherwise({
		redirectTo : '/404'
	});
});