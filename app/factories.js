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
/*
.factory('CharacterFactory', function(){
	return new LocalRepository('Character');
})
.factory('NewsFactory', function(){
	return new LocalRepository('New');
})
.factory('VideoFactory', function(){
	return new LocalRepository('Video');
})
.factory('GameFactory', function(){
	return new LocalRepository('Game');
});*/