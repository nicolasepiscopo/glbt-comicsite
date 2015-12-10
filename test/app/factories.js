app
.factory('UserFactory', function(){
	return new LocalRepository('User');
})
.factory('ComicFactory', function(){
	return new LocalRepository('Comic');
})
.factory('GenreFactory', function(){
	return new LocalRepository('Genre');
})
.factory('QualificationFactory', function(){
	return new LocalRepository('Qualification');
})
.factory('VisitFactory', function(){
	return new LocalRepository('Visit');
})
.factory('CommentFactory', function(){
	return new LocalRepository('Comment');
})
.factory('EditionFactory', function(){
	return new LocalRepository('Edition');
})
.factory('NumberFactory', function(){
	return new LocalRepository('Number');
})
.factory('CharacterFactory', function(){
	return new LocalRepository('Character');
})
.factory('NewsFactory', function(){
	return new LocalRepository('New');
})
.factory('CopyFactory', function(){
	return new LocalRepository('Copy');
})
.factory('LoanHistoryFactory', function(){
	return new LocalRepository('LoanHistory');
});