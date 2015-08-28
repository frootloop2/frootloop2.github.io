window.Input = (function() {
	var maxSpeed = 12,
		acceleration = 1,
		friction = 1,
		leftKey = Keyboard.Keys.LEFT,
		rightKey = Keyboard.Keys.RIGHT,
		angleUpKey = Keyboard.Keys.UP,
		angleDownKey = Keyboard.Keys.DOWN,
		jumpKey = Keyboard.Keys.Z,
		throwKey = Keyboard.Keys.X;
		doorKey = Keyboard.Keys.C;

	return {
		runSystem: function(model) {
			model.getEntities().filter(function(entity) {
				return entity.player;
			}).forEach(function(playerEntity) {
				var newBoomerang;

				// movement
				if(Keyboard.isKeyPressed(leftKey)) {
					playerEntity.dx = Math.max(playerEntity.dx - acceleration, -maxSpeed);
				}
				if(Keyboard.isKeyPressed(rightKey)) {
					playerEntity.dx = Math.min(playerEntity.dx + acceleration, maxSpeed);
				}
				if(Keyboard.isKeyPressed(rightKey) === Keyboard.isKeyPressed(leftKey)) {
					if(playerEntity.dx > 0) {
						playerEntity.dx = Math.max(0, playerEntity.dx - friction);
					} else {
						playerEntity.dx = Math.min(0, playerEntity.dx + friction);
					}
				}
				
				// turn
				if(Keyboard.isKeyPressed(leftKey)) {
					if(!Keyboard.isKeyPressed(rightKey)) {
						playerEntity.playerFacingRight = false;
					}
				} else if(Keyboard.isKeyPressed(rightKey)) {
					playerEntity.playerFacingRight = true;
				}

				// jump
				if(Keyboard.isKeyPressedSinceStartOfLastFrame(jumpKey)) {
					if(playerEntity.dy === 0 && playerEntity.landed) {
						playerEntity.dy = 20;
						playerEntity.landed = false;
					}
				}

				// throw
				if(Keyboard.isKeyPressedSinceStartOfLastFrame(throwKey)) {
					if(model.getEntities().filter(function(e) {return e.boomerang}).length === 0) {
						newBoomerang = {
							x: playerEntity.x,
							y: playerEntity.y,
							width: 30,
							height: 30,
							color: "#77FF77",
							destEntity: playerEntity,						
							boomerang: true,
							boomerangSpeed: 30,
							boomerangAngle: 0,
							boomerangMode: "leaving",
							boomerangLife: 100
						};
						if(Keyboard.isKeyPressed(angleUpKey) && !Keyboard.isKeyPressed(angleDownKey)) {
							newBoomerang.boomerangAngle = 45;
						} else if(!Keyboard.isKeyPressed(angleUpKey) && Keyboard.isKeyPressed(angleDownKey)) {
							newBoomerang.boomerangAngle = 315;
						}

						if(!playerEntity.playerFacingRight) {
							newBoomerang.x -= playerEntity.width;
							newBoomerang.boomerangAngle = (-newBoomerang.boomerangAngle + 180 + 360) % 360;
						} else {
							newBoomerang.x += playerEntity.width;
						}

						if(model.getEntities().filter(function(e) {return e.collidable && Entity.overlapsEntity(e, newBoomerang)}).length === 0) {
							model.getEntities().push(newBoomerang);
						}
					}
				}

				// use door
				if(Keyboard.isKeyPressedSinceStartOfLastFrame(doorKey)) {
					model.getEntities().filter(function(entity) {return entity.door}).forEach(function(doorEntity) {
						if(Entity.overlapsEntity(playerEntity, doorEntity)) {
							model.loadRoom(doorEntity.doorDestination);
						}
					});
				}
			});
		}
	};
}());