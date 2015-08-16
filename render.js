window.Render = (function() {
	var canvas,
		context;

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

	function renderEntity(entity, view, camera) {
		var widthRatio = canvas.width / view.width,
			heightRatio = canvas.height / view.height;
		context.fillStyle = entity.color;
		context.fillRect((Entity.getLeft(entity) - (camera.x - view.width / 2)) * widthRatio, // x
						 canvas.height - Entity.getTop(entity) * heightRatio, // y
						 entity.width * widthRatio, // width
						 entity.height * heightRatio, // height
						 entity.color // color
		);
	};

	return {
		runSystem: function(model) {
			context.clearRect(0, 0, canvas.width, canvas.height);
			model.getEntities().forEach(function(entity) {
				var clonedEntity;
				renderEntity(entity, model.getView(), model.getCamera());
				if(entity.wraps === true) {
					clonedEntity = Entity.clone(entity);
					clonedEntity.x += model.getView().width;
					renderEntity(clonedEntity, model.getView(), model.getCamera());
					clonedEntity.x -= 2 * model.getView().width;
					renderEntity(clonedEntity, model.getView(), model.getCamera());
				}
			});
		}
	};
}());