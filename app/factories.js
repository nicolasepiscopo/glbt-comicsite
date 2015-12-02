app
.factory('UserFactory', function(){
	return new LocalRepository('User');
})
.factory('ComicFactory', function(){
	return new LocalRepository('Comic');
})
.factory('AuthorFactory', function(){
	return new LocalRepository('Author');
})
.factory('CharacterFactory', function(){
	return new LocalRepository('Character');
})
.factory('GenreFactory', function(){
	return new LocalRepository('Genre');
})
.factory('EditionFactory', function(){
	return new LocalRepository('Edition');
})
.factory('QualificationFactory', function(){
	return new LocalRepository('Qualification');
})
.factory('RecommendationFactory', function(){
	return new LocalRepository('Recommendation');
})
.factory('PhysicalCopyFactory', function(){
	return new LocalRepository('PhysicalCopy');
})
.factory('LoanFactory', function(){
	return new LocalRepository('Loan');
})
.factory('NewsFactory', function(){
	return new LocalRepository('New');
})
.factory('VideoFactory', function(){
	return new LocalRepository('Video');
})
.factory('GameFactory', function(){
	return new LocalRepository('Game');
});