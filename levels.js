window.Rooms = [
	[
		// the order of the entities in this array is the order they are drawn, with newer entities covering previous entities
		{
			x: 0,
			y: 50,
			width: 1200,
			height: 100,
			color: "#777777",
			collidable: true
		},
		{
			x: 0,
			y: 125,
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
			x: -500,
			y: 150,
			width: 50,
			height: 50,
			color: "#FF7777",
			target: true
		},
		{
			x: 500,
			y: 150,
			width: 50,
			height: 50,
			color: "#FF7777",
			target: true
		},
		{
			x: 0,
			y: 350,
			width: 50,
			height: 50,
			color: "#FF7777",
			target: true
		}
	]
];