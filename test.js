var numToWin = 5;
var boardSize = 19;
var turn = "blue";
var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
canvas.width = Math.min(window.innerWidth, window.innerHeight);
canvas.height = canvas.width;
document.body.style.margin = 0;
document.body.appendChild(canvas);
var squareSize = Math.floor(canvas.width / (boardSize + 4));
var setupBoard = function() {
	board = [];
	projections = {
		top: [],
		bottom: [],
		left: [],
		right: []
	};
	for(i = 0; i < boardSize; i++) {
		board.push([]);
		projections.top.push("black");
		projections.bottom.push("black");
		projections.left.push("black");
		projections.right.push("black");
		for(j = 0; j < boardSize; j++) {
			board[board.length - 1].push("black");
		}
	}
};
var gameloop = function() {
	requestAnimationFrame(gameloop);
	render();
};
var render = function() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	for(i = 0; i < boardSize; i++) {
		context.fillStyle = projections.top[i];
		context.fillRect((2 + i) * squareSize, 0, squareSize, squareSize);
		context.fillStyle = projections.bottom[i];
		context.fillRect((2 + i) * squareSize, (boardSize + 3) * squareSize, squareSize, squareSize);
		context.fillStyle = projections.left[i];
		context.fillRect(0, (2 + i) * squareSize, squareSize, squareSize);
		context.fillStyle = projections.right[i];
		context.fillRect((boardSize + 3) * squareSize, (2 + i) * squareSize, squareSize, squareSize);
		for(j = 0; j < boardSize; j++) {
			context.fillStyle = board[i][j];
			context.fillRect((2 + i) * squareSize, (2 + j) * squareSize, squareSize, squareSize);
		}
	}
};
var computeProjections = function() {
	for(i = 0; i < boardSize; i++) {
		for(j = 0; j < boardSize; j++) {
			if(board[i][j] !== "black") {
				projections.top[i] = board[i][j];
				break;
			}
		}
	}
	for(i = 0; i < boardSize; i++) {
		for(j = boardSize - 1; j >= 0; j--) {
			if(board[i][j] !== "black") {
				projections.bottom[i] = board[i][j];
				break;
			}
		}
	}
	for(j = 0; j < boardSize; j++) {
		for(i = 0; i < boardSize; i++) {
			if(board[i][j] !== "black") {
				projections.left[j] = board[i][j];
				break;
			}
		}
	}
	for(j = 0; j < boardSize; j++) {
		for(i = boardSize - 1; i >= 0; i--) {
			if(board[i][j] !== "black") {
				projections.right[j] = board[i][j];
				break;
			}
		}
	}
};
var checkWinner = function() {
	var numInARow,
		color;
	numInARow = 0;
	color = "black";
	for(i = 0; i < boardSize; i++) {
		if(projections.top[i] === color) {
			numInARow++;
			if(color !== "black" && numInARow >= numToWin) {
				alert(color + " wins at the top");
				setupBoard();
			}
		} else {
			color = projections.top[i];
			numInARow = 1;
		}
	}
	numInARow = 0;
	color = "black";
	for(i = 0; i < boardSize; i++) {
		if(projections.bottom[i] === color) {
			numInARow++;
			if(color !== "black" && numInARow >= numToWin) {
				alert(color + " wins at the bottom");
				setupBoard();
			}
		} else {
			color = projections.bottom[i];
			numInARow = 1;
		}
	}
	numInARow = 0;
	color = "black";
	for(i = 0; i < boardSize; i++) {
		if(projections.left[i] === color) {
			numInARow++;
			if(color !== "black" && numInARow >= numToWin) {
				alert(color + " wins at the left");
				setupBoard();
			}
		} else {
			color = projections.left[i];
			numInARow = 1;
		}
	}
	numInARow = 0;
	color = "black";
	for(i = 0; i < boardSize; i++) {
		if(projections.right[i] === color) {
			numInARow++;
			if(color !== "black" && numInARow >= numToWin) {
				alert(color + " wins at the right");
				setupBoard();
			}
		} else {
			color = projections.right[i];
			numInARow = 1;
		}
	}
};
canvas.addEventListener("click", function(ev) {
	var x = Math.floor(ev.clientX / squareSize) - 2;
	var y = Math.floor(ev.clientY / squareSize) - 2;
	if(board[x][y] === "black") {
		board[x][y] = turn;
		if(turn === "blue") {
			turn = "red";
		} else {
			turn = "blue";
		}
		computeProjections();
		render();
		checkWinner();
	}
});
setupBoard();
render();
alert("Click in the middle to play a piece.\n5 in a row on one of the projected sides wins.");
gameloop();