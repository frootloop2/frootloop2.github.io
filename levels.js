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
			y: 150,
			width: 50,
			height: 100,
			color: "#000000",
			gravity: false,
			door: true,
			doorDestination: 1
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
		}
	],
	[
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
			y: 450,
			width: 50,
			height: 100,
			color: "#000000",
			gravity: false,
			door: true,
			doorDestination: 2
		},
		{
			x: 300,
			y: 450,
			width: 50,
			height: 100,
			color: "#000000",
			gravity: false,
			door: true,
			doorDestination: 0
		},
		{
			x: 400,
			y: 550,
			dx: 0,
			dy: 0,
			width: 50,
			height: 50,
			color: "#7777FF",
			collidable: true,
			gravity: true,
			player: true
		}
	]
];