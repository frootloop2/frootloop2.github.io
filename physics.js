window.Physics = (function() {
	function closestToValue(v, a, b) {
		return Math.abs(a - v) < Math.abs(b - v) ? a : b;
	};
	return {
		runSystem: function(model) {
			// gravity
			model.getEntities().filter(function(entity) {
				return entity.gravity && entity.dy !== undefined;
			}).forEach(function(entity) {
				entity.dy--;
			});

			// step x
			model.getEntities().filter(function(entity) {
				return entity.x !== undefined && entity.y !== undefined && entity.dx !== undefined && entity.dy !== undefined && entity.collidable === true;
			}).forEach(function(entity) {
				var distanceToNearestEntity,
					nearEdge,
					farEdge;

				distanceToNearestEntity = Infinity;

				nearEdge = (entity.dx > 0) ? Entity.getLeft : Entity.getRight;
				farEdge = (entity.dx > 0) ? Entity.getRight: Entity.getLeft;

				model.getEntities().filter(function(otherEntity) {
					var otherEntityOverlapsEntityZone,
						otherEntityInDirectionOfEntityMovement;

					otherEntityOverlapsEntityZone = Entity.getTop(entity) > Entity.getBottom(otherEntity) && Entity.getBottom(entity) < Entity.getTop(otherEntity);
					otherEntityInDirectionOfEntityMovement = (nearEdge(otherEntity) - entity.x) * (farEdge(entity) - entity.x) >= 0;
					return otherEntity !== entity && otherEntity.collidable === true && otherEntityOverlapsEntityZone && otherEntityInDirectionOfEntityMovement;
				}).forEach(function(otherEntity) {
					var distanceToOtherEntity;
					distanceToOtherEntity = nearEdge(otherEntity) - farEdge(entity);
					distanceToNearestEntity = closestToValue(0, distanceToOtherEntity, distanceToNearestEntity);
				});
				entity.x += closestToValue(0, distanceToNearestEntity, entity.dx);
				if(entity.heldEntity !== undefined) {
					entity.heldEntity.x += closestToValue(0, distanceToNearestEntity, entity.dx);
				}
				if(Math.abs(distanceToNearestEntity) < Math.abs(entity.dx)) {
					entity.dx = 0;
				}
			});

			// step y
			model.getEntities().filter(function(entity) {
				return entity.x !== undefined && entity.y !== undefined && entity.dx !== undefined && entity.dy !== undefined && entity.collidable === true;
			}).forEach(function(entity) {
				var distanceToNearestEntity,
					nearEdge,
					farEdge;

				distanceToNearestEntity = Infinity;

				nearEdge = (entity.dy > 0) ? Entity.getBottom : Entity.getTop;
				farEdge = (entity.dy > 0) ? Entity.getTop : Entity.getBottom;

				model.getEntities().filter(function(otherEntity) {
					var otherEntityOverlapsEntityZone,
						otherEntityInDirectionOfEntityMovement;

					otherEntityOverlapsEntityZone = Entity.getRight(entity) > Entity.getLeft(otherEntity) && Entity.getLeft(entity) < Entity.getRight(otherEntity);
					otherEntityInDirectionOfEntityMovement = (nearEdge(otherEntity) - entity.y) * (farEdge(entity) - entity.y) >= 0;
					return entity !== otherEntity && otherEntity.collidable === true && otherEntityOverlapsEntityZone && otherEntityInDirectionOfEntityMovement;
				}).forEach(function(otherEntity) {
					var distanceToOtherEntity;
					
					distanceToOtherEntity = nearEdge(otherEntity) - farEdge(entity);
					distanceToNearestEntity = closestToValue(0, distanceToOtherEntity, distanceToNearestEntity);
				});
				entity.y += closestToValue(0, distanceToNearestEntity, entity.dy);
				if(entity.heldEntity !== undefined) {
					entity.heldEntity.y += closestToValue(0, distanceToNearestEntity, entity.dy);
				}
				if(Math.abs(distanceToNearestEntity) < Math.abs(entity.dy)) {
					entity.dy = 0;
					entity.landed = true;
				}
			});

			// death
			model.getEntities().filter(function(entity) {
				return entity.player;
			}).forEach(function(entity) {
				if(entity.y < 0)
					model.restartLevel();
			});
		}
	};
}());