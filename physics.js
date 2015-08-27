window.Physics = (function() {
	function closestToValue(v, a, b) {
		return Math.abs(a - v) < Math.abs(b - v) ? a : b;
	};

	function getShortestDistBetweenAngles(a, b) {
		return Math.min(Math.abs(a - b), 360 - Math.abs(a - b));
	};

	function gravity(model) {
		model.getEntities().filter(function(e) {
			return e.gravity && e.dy !== undefined;
		}).forEach(function(e) {
			e.dy--;
		});
	};

	function stepX(model) {
		model.getEntities().filter(function(entity) {
			return entity.x !== undefined && entity.y !== undefined && entity.dx !== undefined && entity.dy !== undefined;
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
				return otherEntity !== entity && otherEntity.collidable && entity.collidable && otherEntityOverlapsEntityZone && otherEntityInDirectionOfEntityMovement;
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
	};

	function stepY(model) {
		model.getEntities().filter(function(entity) {
			return entity.x !== undefined && entity.y !== undefined && entity.dx !== undefined && entity.dy !== undefined;
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
				return entity !== otherEntity && otherEntity.collidable && entity.collidable && otherEntityOverlapsEntityZone && otherEntityInDirectionOfEntityMovement;
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
	};

	function death(model) {
		model.getEntities().filter(function(e) {return e.player}).forEach(function(p) {
			if(p.y < 0) {
				model.restartLevel();
			}
		});
	};

	function boomerang(model) {
		model.getEntities().filter(function(e) {return e.boomerang}).forEach(function(b) {
			var vectorToPlayer,
				angleToPlayer,
				turnAmount = 2,
				maxReturnSpeed = 15,
				dx,
				dy,
				distanceToNearestEntity,
				nearestEntity,
				nearEdge,
				farEdge,
				angleThreshold = 50;

			b.boomerangLife--;
			if(b.boomerangLife <= 0) {
				model.getEntities().splice(model.getEntities().indexOf(b), 1);
				return;
			}

			vectorToPlayer = {
				x: b.x - b.destEntity.x,
				y: b.y - b.destEntity.y
			};

			xPositive = (vectorToPlayer.x > 0)

			angleToPlayer = ((xPositive * 180 + Math.atan(vectorToPlayer.y / vectorToPlayer.x) * 360 / (2 * Math.PI)) + 360) % 360

			if(Entity.overlapsEntity(b, b.destEntity)) {
				model.getEntities().splice(model.getEntities().indexOf(b), 1);
				return;
			}

			if(b.boomerangMode === "leaving") {
				// step X
				dx = b.boomerangSpeed * Math.cos(2 * Math.PI * b.boomerangAngle / 360);
				distanceToNearestEntity = Infinity;

				nearEdge = (dx > 0) ? Entity.getLeft : Entity.getRight;
				farEdge = (dx > 0) ? Entity.getRight : Entity.getLeft;

				model.getEntities().filter(function(otherEntity) {
					var otherEntityOverlapsEntityZone,
						otherEntityInDirectionOfEntityMovement;

					otherEntityOverlapsEntityZone = Entity.getTop(b) > Entity.getBottom(otherEntity) && Entity.getBottom(b) < Entity.getTop(otherEntity);
					otherEntityInDirectionOfEntityMovement = (nearEdge(otherEntity) - b.x) * (farEdge(b) - b.x) >= 0;
					return b !== otherEntity && (otherEntity.collidable || otherEntity.target) && otherEntityOverlapsEntityZone && otherEntityInDirectionOfEntityMovement;
				}).forEach(function(otherEntity) {
					var distanceToOtherEntity;
					
					distanceToOtherEntity = nearEdge(otherEntity) - farEdge(b);
					distanceToNearestEntity = closestToValue(0, distanceToOtherEntity, distanceToNearestEntity);
					if(distanceToNearestEntity === distanceToOtherEntity) {
						nearestEntity = otherEntity;
					}
				});
				b.x += closestToValue(0, distanceToNearestEntity, dx);
				if(Math.abs(distanceToNearestEntity) < Math.abs(dx)) {
					if(nearestEntity.player === true) {
						model.getEntities().splice(model.getEntities().indexOf(b), 1);
						return;
					}
					if(nearestEntity.target === true) {
						nearestEntity.target = undefined;
						nearestEntity.width /= 2;
						nearestEntity.height /= 2;
						nearestEntity.color = "#777777";
						nearestEntity.collidable = true;
						//model.getEntities().splice(model.getEntities().indexOf(nearestEntity), 1);
					}
					if(getShortestDistBetweenAngles(b.boomerangAngle, 0) < angleThreshold || getShortestDistBetweenAngles(b.boomerangAngle, 180) < angleThreshold) {
						b.boomerangMode = "returning";
						b.boomerangAngle = (b.boomerangAngle - 180 + 360) % 360;
					} else {
						b.boomerangAngle = (-b.boomerangAngle + 180 + 360) % 360;
						b.x += dx - distanceToNearestEntity;
					}
				}

				//step Y
				nearestEntity = undefined
				dy = b.boomerangSpeed * Math.sin(2 * Math.PI * b.boomerangAngle / 360);
				distanceToNearestEntity = Infinity;

				nearEdge = (dy > 0) ? Entity.getBottom : Entity.getTop;
				farEdge = (dy > 0) ? Entity.getTop : Entity.getBottom;

				model.getEntities().filter(function(otherEntity) {
					var otherEntityOverlapsEntityZone,
						otherEntityInDirectionOfEntityMovement;

					otherEntityOverlapsEntityZone = Entity.getRight(b) > Entity.getLeft(otherEntity) && Entity.getLeft(b) < Entity.getRight(otherEntity);
					otherEntityInDirectionOfEntityMovement = (nearEdge(otherEntity) - b.y) * (farEdge(b) - b.y) >= 0;
					return b !== otherEntity && otherEntity.collidable && otherEntityOverlapsEntityZone && otherEntityInDirectionOfEntityMovement;
				}).forEach(function(otherEntity) {
					var distanceToOtherEntity;
					
					distanceToOtherEntity = nearEdge(otherEntity) - farEdge(b);
					distanceToNearestEntity = closestToValue(0, distanceToOtherEntity, distanceToNearestEntity);
					if(distanceToNearestEntity === distanceToOtherEntity) {
						nearestEntity = otherEntity;
					}
				});
				b.y += closestToValue(0, distanceToNearestEntity, dy);
				if(Math.abs(distanceToNearestEntity) < Math.abs(dy)) {
					if(nearestEntity.player === true) {
						model.getEntities().splice(model.getEntities().indexOf(b), 1);
						return;
					}
					if(nearestEntity.target === true) {
						nearestEntity.target = undefined;
						nearestEntity.width /= 2;
						nearestEntity.height /= 2;
						nearestEntity.color = "#777777";
						nearestEntity.collidable = true;
						//model.getEntities().splice(model.getEntities().indexOf(nearestEntity), 1);
					}
					
					if(getShortestDistBetweenAngles(b.boomerangAngle, 90) < angleThreshold || getShortestDistBetweenAngles(b.boomerangAngle, 270) < angleThreshold) {
						b.boomerangMode = "returning";
						b.boomerangAngle = (b.boomerangAngle - 180 + 360) % 360;
					} else {
						b.boomerangAngle = (-b.boomerangAngle + 360) % 360;
						b.y += dy - distanceToNearestEntity;
					}
				}

				b.boomerangSpeed = (b.boomerangSpeed - 1 + 360) % 360;

				if(b.boomerangSpeed <= 0) {
					b.boomerangMode = "returning";
					b.boomerangSpeed = 0;
					b.boomerangAngle = angleToPlayer;
				}
			} else if(b.boomerangMode === "returning") {
				if(b.boomerangSpeed <= maxReturnSpeed) {
					b.boomerangSpeed++;
				}

				model.getEntities().filter(function(e){return e.target}).forEach(function(t) {
					if(Entity.overlapsEntity(b, t)) {
						t.target = undefined;
						t.width /= 2;
						t.height /= 2;
						t.color = "#777777";
						t.collidable = true;
						//model.getEntities().splice(model.getEntities().indexOf(t), 1);
					}
				});

				// turn towards player
				if(getShortestDistBetweenAngles(angleToPlayer, b.boomerangAngle) < turnAmount) {
					b.boomerangAngle = angleToPlayer;
				} else if(getShortestDistBetweenAngles(angleToPlayer, b.boomerangAngle + turnAmount) < getShortestDistBetweenAngles(angleToPlayer, b.boomerangAngle - turnAmount)) {
					b.boomerangAngle = (b.boomerangAngle + turnAmount + 360) % 360;
				} else {
					b.boomerangAngle = (b.boomerangAngle - turnAmount + 360) % 360;
				}
				
				b.x += b.boomerangSpeed * Math.cos(2 * Math.PI * b.boomerangAngle / 360);
				b.y += b.boomerangSpeed * Math.sin(2 * Math.PI * b.boomerangAngle / 360);
			}
		});
	};

	return {
		runSystem: function(model) {
			gravity(model);
			stepX(model);
			stepY(model);
			boomerang(model);
			death(model);
		}
	};
}());