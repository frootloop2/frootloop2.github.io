window.Model = {
	create: function() {
		// TODO: make the structure private vars and have methods on the return object to deal with them.
		var entities = [],
			roomNum = 0;
		return {
			getEntities: function() {
				return entities;
			},
			getRoomNum: function() {
				return roomNum;
			},
			loadRoom: function(destinationRoomNum) {
				if(destinationRoomNum >= window.Rooms.length) {
					console.log("error: room " + destinationRoomNum + " not found");
					return;
				}
				roomNum = destinationRoomNum;
				entities = [];
				window.Rooms[roomNum].forEach(function(entity) {
					// copy the entities so we don't change the contents of window.Levels
					// this makes the level 'reset' next time the player comes back to it.
					entities.push(Entity.clone(entity));
				});
			},
			restartLevel: function() {
				this.loadRoom(this.getRoomNum());
			}
		}
	}  
};