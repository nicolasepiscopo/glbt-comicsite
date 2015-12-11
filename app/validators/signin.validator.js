(function(){
	app.service('SignInValidator', validator);
	function validator(UserFactory){
		this.runValidation = function(scope){
			var messages = [];
			//Verify if his username or email already exists
			var userFound = UserFactory.find(function(user){
				//Find by username and password
				return (user.username==scope.user.username)&&(user.password==scope.user.password);
			});		
			if(!userFound)
				messages.push("The username and/or password are incorrect.");
			//Check if the whole form is valid
			var isValid = userFound;
			if(isValid)
				messages.push("Welcome "+userFound.username+"!");
			return {
				isValid : isValid,
				messages : messages
			}
		}
	}
})();