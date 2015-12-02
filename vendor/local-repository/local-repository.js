var LocalRepository = (function(name){
	/* Constructor */
	var name = name;
	
	if(!localStorage.getItem(name)){
		localStorage.setItem(name, JSON.stringify([]));
		localStorage.setItem(name+"_nextId", 0);
	}
	var nextId = JSON.parse(localStorage.getItem(name+"_nextId"));
	var physicalCollection = JSON.parse(localStorage.getItem(name));

	/* Private Methods & properties */
	var collection = {
		get : function(){			
			return physicalCollection;
		},
		add : function(element){
			element.id = ++nextId;
			element.createdOn = new Date();
			physicalCollection.push(element);
			localStorage.setItem(name, JSON.stringify(physicalCollection));
			localStorage.setItem(name+"_nextId", nextId);
			return physicalCollection;
		},
		remove : function(id){
			var objectIndex = physicalCollection.findIndex(function(element){
				return element.id==id;
			});
			physicalCollection.splice(objectIndex, 1);
			localStorage.setItem(name, JSON.stringify(physicalCollection));
			localStorage.setItem(name+"_nextId", nextId);
			return physicalCollection;
		},
		update : function(updatedElement){
			var objectIndex = physicalCollection.findIndex(function(element){
				return element.id==updatedElement.id;
			});
			if(objectIndex>0){
				physicalCollection[objectIndex] = updatedElement;
				localStorage.setItem(name, JSON.stringify(physicalCollection));
				localStorage.setItem(name+"_nextId", nextId);
				return physicalCollection;
			}else{
				return false;
			}
		},
		clear : function(){
			physicalCollection = [];
			localStorage.setItem(name, JSON.stringify(physicalCollection));
			localStorage.setItem(name+"_nextId", 0);
			return physicalCollection;
		}
	}

	/* Public Methods */	
	return {
		find : function(callback){
			if(callback)
				return collection.get().find(callback);
			else
				return collection.get();
		},
		add : function(element){
			collection.add(element);
			return this;
		},
		remove : function(id){
			collection.remove(id);
		},
		update : function(updatedElement){
			collection.update(updatedElement);
		},
		clear : function(){
			collection.clear();
			return this;
		}
	}
});