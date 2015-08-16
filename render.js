window.Render = (function() {
	var canvas,
		context,
		scrollAmount;

	canvas = document.createElement("canvas");
	canvas.width = Math.min(window.innerWidth / 16, window.innerHeight / 9) * 16;
	canvas.height = Math.min(window.innerWidth / 16, window.innerHeight / 9) * 9;
	canvas.style.position = "absolute";
	canvas.style.top = 0;
	canvas.style.bottom = 0;
	canvas.style.left = 0;
	canvas.style.right = 0;
	canvas.style.margin = "auto";
	canvas.style.backgroundColor = "#FFFFFF";
	document.body.appendChild(canvas);
	window.onresize = function() {
		canvas.width = Math.min(window.innerWidth / 16, window.innerHeight / 9) * 16;
		canvas.height = Math.min(window.innerWidth / 16, window.innerHeight / 9) * 9;
	};

	context = canvas.getContext("2d");

	function renderEntity(entity) {
		context.fillStyle = entity.color;
		context.fillRect((Entity.getLeft(entity) - scrollAmount), // x
						 canvas.height - Entity.getTop(entity), // y
						 entity.width, // width
						 entity.height, // height
						 entity.color // color
		);
	};

	return {
		runSystem: function(model) {
			if(scrollAmount === undefined) {
				scrollAmount = 0;
			} else {
				model.getEntities().filter(function(e) {
					return e.player === true;
				}).forEach(function(p) {
					if(Entity.getLeft(p) - scrollAmount < canvas.width / 3) {
						scrollAmount = Entity.getLeft(p) - canvas.width / 3;
					}
					if(Entity.getRight(p) - scrollAmount > canvas.width * 2 / 3) {
						scrollAmount = Entity.getRight(p) - canvas.width * 2 / 3;
					}
				});
			}

			context.clearRect(0, 0, canvas.width, canvas.height);
			
			model.getEntities().forEach(function(entity) {
				renderEntity(entity);
			});
		}
	};
}());