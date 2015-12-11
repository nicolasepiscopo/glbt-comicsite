(function(){
	app.controller('RatingController', controller);
	function controller($scope, SecurityService, QualificationFactory, ComicFactory, SessionService){
		var id = $scope.$parent.comic.id;
		if(SecurityService.isUser()){
			/* User rating shown at start */
			var rating = QualificationFactory.find(function(q){
				return (q.user == SessionService.get('user').id)&&(q.comic==id);
			});
			if(rating)
				$scope.rating = rating.stars;			

			/* Rate a comic */
			$scope.rate = function(){
				var previousRatingByUser = QualificationFactory.find(function(q){
					return (q.user == SessionService.get('user').id)&&(q.comic==id);
				});
				if(previousRatingByUser){
					//modify qualification
					previousRatingByUser.stars = $scope.rating;
					QualificationFactory.update(previousRatingByUser);
				}else{
					//create qualification
					QualificationFactory.add({
						comic : id,
						user : SessionService.get('user').id,
						stars : $scope.rating
					});
				}
			};
		}

		/* Calculate global rating for one comic */
		$scope.calculateRating = function(){		
			var quantity = 0; 
			var total = 0;

			QualificationFactory.find().forEach(function(q){
				if(q.comic==id){
					quantity++;
					total += q.stars;
				}
			});

			$scope.communityRating = Math.ceil(total/quantity);

			/* Update rating */
			if($scope.$parent.comic.rating != $scope.communityRating){
				$scope.$parent.comic.rating = $scope.communityRating;
				ComicFactory.update($scope.$parent.comic);
			}

			$scope.stars = [
				{ name : "1 Star", value : 1 },
				{ name : "2 Stars", value : 2 },
				{ name : "3 Stars", value : 3 },
				{ name : "4 Stars", value : 4 },
				{ name : "5 Stars", value : 5 },
			];
		};

		/* Runs at start */
		$scope.calculateRating();
	}
})();