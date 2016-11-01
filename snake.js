//Constants
var COLS = 40, ROWS = 40;

// IDs
var EMPTY = 0;
var SNAKE = 1;
var FRUIT = 2;

//KeyCodes
var KEY_LEFT = 37
var KEY_UP = 38
var KEY_RIGHT = 39
var KEY_DOWN = 40

//Directions
var LEFT = 0, UP = 1, RIGHT = 2, DOWN = 3;

//Grid Object
var grid = {

	width: null,
	height: null,
	_grid: null,

	init: function(d, c, r) {
		this.width = c;
		this.height = r;

		this._grid = [];
		for(var x = 0; x < c; x++) {
			this._grid.push([]);
			for(var y = 0; y < r; y++) {
				this._grid[x].push(d);
			}
		}

	},

	set: function(val, x, y) {
		this._grid[x][y] = val;
	},

	get: function(x, y) {
		return this._grid[x][y];
	}
}

//Snake Object
var snake = {

	direction: null,
	last: null,
	_queue: null,

	init: function(d, x, y) {
		this.direction = d;

		this._queue = [];
		this.insert(x, y);
	},

	insert: function(x, y) {
		this._queue.unshift({x:x, y:y});
		this.last = this._queue[0];
	},

	remove: function() {
		return this._queue.pop();
	}
}

function setFood() {
	var empty = [];
	for (var x = 0; x < grid.width; x++) {
		for (var y = 0; y < grid.height; y++) {
			if (grid.get(x, y) === EMPTY) {
				empty.push({x:x, y:y});
			}
		}
	}
	var randpos = empty[Math.floor(Math.random() * (empty.length - 1))];
	grid.set(FRUIT, randpos.x, randpos.y);
}

function main() {
	canvas = document.createElement("canvas");
	canvas.width = COLS * 10;
	canvas.height = ROWS * 10;
	ctx = canvas.getContext("2d");
	document.body.appendChild(canvas);

	frames = 0;
	keystate = {};
	document.addEventListener("keydown", function(evt) {
		keystate[evt.keyCode] = true;
	});
	document.addEventListener("keyup", function(evt) {
		delete keystate[evt.keyCode];
	});

	init();
	loop();
}

function init() {
	grid.init(EMPTY, COLS, ROWS);

	var sp = {x:Math.floor(COLS / 2), y:ROWS - 10};
	snake.init(UP, sp.x, sp.y);
	grid.set(SNAKE, sp.x, sp.y);

	setFood();
}

function loop() {
	update();
	draw();

	window.requestAnimationFrame(loop, canvas);
}

function update() {
	frames++;

	if (keystate[KEY_LEFT] && snake.direction !== RIGHT)
	 	snake.direction = LEFT;
	if (keystate[KEY_UP] && snake.direction !== DOWN)
		snake.direction = UP;
	if (keystate[KEY_RIGHT] && snake.direction !== LEFT)
	 	snake.direction = RIGHT;
	if (keystate[KEY_DOWN] && snake.direction !== UP) 
		snake.direction = DOWN;

	if (frames % 5 === 0) {
		var nx = snake.last.x;
		var ny = snake.last.y;

		switch (snake.direction) {
			case LEFT:
				nx--;
				break;
			case UP:
				ny--;
				break;
			case RIGHT:
				nx++;
				break;
			case DOWN:
				ny++;
				break;
		}

		if (0 > nx || nx > grid.width - 1 || 0 > ny || ny > grid.height - 1 || grid.get(nx, ny) === SNAKE) {
			return init();
		}

		if (grid.get(nx, ny) === FRUIT) {
			setFood();
			snake.insert(nx, ny);
			console.log(snake._queue);
		}

		var tail = snake.remove();
		grid.set(EMPTY, tail.x, tail.y);
		tail.x = nx;
		tail.y = ny;
		grid.set(SNAKE, tail.x, tail.y);

		snake.insert(tail.x, tail.y);
	}
}

function draw() {
	var tw = canvas.width / grid.width;
	var th = canvas.height / grid.height;

	for (var x = 0; x < grid.width; x++) {
		for (var y = 0; y < grid.height; y++) {
			switch (grid.get(x, y)) {
				case EMPTY:
					ctx.fillStyle = "#fff";
					break;
				case SNAKE:
					ctx.fillStyle = "#0ff";
					break;
				case FRUIT:
					ctx.fillStyle = "#f00";
					break;
			}
			ctx.fillRect(x*tw, y*th, tw, th);
		}
	}	
}

main();
