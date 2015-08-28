window.Model = {
	create: function() {
		var entities = [],
			roomNum = 0,
			timeOfLoad = 0,
			timeTaken;
		return {
			getEntities: function() {
				return entities;
			},
			getTargetsRemaining: function() {
				var numRemaining = entities.filter(function(e) {return e.target}).length;
				if(numRemaining === 0 && timeTaken === undefined) {
					timeTaken = window.performance.now() - timeOfLoad;
				}
				return numRemaining;
			},
			getTime: function() {
				return timeTaken === undefined ? window.performance.now() - timeOfLoad : timeTaken;
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
				timeOfLoad = window.performance.now();
				timeTaken = undefined;
			},
			restartLevel: function() {
				this.loadRoom(this.getRoomNum());
			}
		}
	}  
};