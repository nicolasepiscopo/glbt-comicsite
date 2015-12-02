app
.service('SignUpValidator', function(UserFactory){
	this.runValidation = function(scope){
		var messages = [];
		//Verify if his username or email already exists
		var alreadyExists = UserFactory.find(function(user){
			//Find by username or email
			return (user.username==scope.user.username)||(user.email==scope.user.email);
		});
		if(alreadyExists)
			messages.push("The email or username already exists.");
		//Verify if both passwords are equal
		var equalPasswords = (scope.user.password==scope.validation.password);
		if(!equalPasswords)
			messages.push("Passwords must match.");
		//Check if TOS are agreeded
		var agreement = scope.validation.agreement;
		if(!agreement)
			messages.push("You must agree the Terms of Service in order to register an account.");
		//Check if the whole form is valid
		var isValid = !alreadyExists && equalPasswords && agreement;
		if(isValid)
			messages.push("You have been registered successfuly!");
		return {
			isValid : isValid,
			messages : messages
		}
	}
})
.service('SignInValidator', function(UserFactory){
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
});