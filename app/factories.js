angular.module('ComicStore').factory('User', function(){
	return new LocalRepository('User');
});
angular.module('ComicStore').factory('Comic', function(){
	return new LocalRepository('Comic');
});
angular.module('ComicStore').factory('Author', function(){
	return new LocalRepository('Author');
});
angular.module('ComicStore').factory('Character', function(){
	return new LocalRepository('Character');
});
angular.module('ComicStore').factory('Genre', function(){
	return new LocalRepository('Genre');
});
angular.module('ComicStore').factory('Edition', function(){
	return new LocalRepository('Edition');
});
angular.module('ComicStore').factory('Qualification', function(){
	return new LocalRepository('Qualification');
});
angular.module('ComicStore').factory('Recommendation', function(){
	return new LocalRepository('Recommendation');
});
angular.module('ComicStore').factory('PhysicalCopy', function(){
	return new LocalRepository('PhysicalCopy');
});
angular.module('ComicStore').factory('Loan', function(){
	return new LocalRepository('Loan');
});
angular.module('ComicStore').factory('New', function(){
	return new LocalRepository('New');
});
angular.module('ComicStore').factory('Video', function(){
	return new LocalRepository('Video');
});
angular.module('ComicStore').factory('Game', function(){
	return new LocalRepository('Game');
});