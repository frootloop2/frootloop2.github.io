(function() {
	var model = Model.create(),
		systems = [
			window.Input,
			window.Physics,
			window.Render
		];

	model.loadRoom(0);

	function gameLoop() {
		Keyboard.tickFrame();
		systems.forEach(function(system) {
			system.runSystem(model);
		});
		requestAnimationFrame(gameLoop);
	};
	
	gameLoop();
}());