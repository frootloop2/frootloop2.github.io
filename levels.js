window.Rooms = [
	[
		// the order of the entities in this array is the order they are drawn, with newer entities covering previous entities
		{
			x: 800,
			y: 350,
			width: 1200,
			height: 100,
			color: "#777777",
			collidable: true
		},
		{
			x: 1200,
			y: 400,
			width: 100,
			height: 1200,
			color: "#777777",
			collidable: true
		},
		{
			x: 300,
			y: 550,
			dx: 0,
			dy: 0,
			width: 50,
			height: 50,
			color: "#7777FF",
			collidable: true,
			gravity: true,
			player: true,
			playerFacingRight: true
		},
		{
			x: 1000,
			y: 500,
			width: 50,
			height: 50,
			color: "#FF7777",
			target: true
		},
		{
			x: 1300,
			y: 500,
			width: 50,
			height: 50,
			color: "#FF7777",
			target: true
		}
	]
];