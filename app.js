const blocksArray = $('.grid > div').toArray();
const copyBlocksArray = Array.from(document.querySelectorAll('.grid div'));
const blocks = $('.grid > div');
const width = 10;
let nextRandom = 0;

// Shapes
const lBlock = [
	[1, width + 1, width * 2 + 1, 2],
	[width, width + 1, width + 2, width * 2 + 2],
	[1, width + 1, width * 2 + 1, width * 2],
	[width, width * 2, width * 2 + 1, width * 2 + 2],
];

const zBlock = [
	[width + 1, width + 2, width * 2, width * 2 + 1],
	[0, width, width + 1, width * 2 + 1],
	[width + 1, width + 2, width * 2, width * 2 + 1],
	[0, width, width + 1, width * 2 + 1],
];

const tBlock = [
	[1, width, width + 1, width + 2],
	[1, width + 1, width + 2, width * 2 + 1],
	[width, width + 1, width + 2, width * 2 + 1],
	[1, width, width + 1, width * 2 + 1],
];

const oBlock = [
	[0, 1, width, width + 1],
	[0, 1, width, width + 1],
	[0, 1, width, width + 1],
	[0, 1, width, width + 1],
];

const iBlock = [
	[1, width + 1, width * 2 + 1, width * 3 + 1],
	[width + 1, width + 2, width + 3, width + 4],
	[1, width + 1, width * 2 + 1, width * 3 + 1],
	[width + 1, width + 2, width + 3, width + 4],
];

const blockShapes = [lBlock, zBlock, tBlock, oBlock, iBlock];

let currentPosition = 4;
let currentRotation = 0;

// Shape randomizer & first rotation of said shapes
// This is to get things started, shape randomizer is called everytime a new block starts printing
const randomPicker = (arr) =>
	arr[Math.floor(Math.random() * blockShapes.length)];
let randomShape = randomPicker(blockShapes);
let current = randomShape[currentRotation];

// Drawing the shapes
function draw() {
	current.forEach((index) => {
		blocksArray[currentPosition + index].classList.add('shapeBlock');
	});
}

// Starting 1st shape
draw();

// Undraw the shape
function undraw() {
	current.forEach((index) => {
		blocksArray[currentPosition + index].classList.remove('shapeBlock');
	});
}

// Make shapes move down at set interval (1s)
const timerId = setInterval(moveDown, 1000);

// Assign functions to keyCodes
function control(e) {
	if (e.keyCode === 37) {
		moveLeft();
	} else if (e.keyCode === 39) {
		moveRight();
	} else if (e.keyCode === 40) {
		moveDown();
	} else if (e.keyCode === 38) {
		rotate();
	}
}

$(document).on('keydown', control);

// Shapes falling function
function moveDown() {
	undraw();
	currentPosition += width;
	draw();
	landing();
}

// Stop shape upon landing
function landing() {
	if (
		current.some((index) =>
			blocksArray[currentPosition + index + width].classList.contains('landed')
		)
	) {
		current.forEach((index) =>
			blocksArray[currentPosition + index].classList.add('landed')
		);
		// New shape falling
		randomShape = nextRandom;
		nextRandom = randomPicker(blockShapes);
		current = randomShape[currentRotation];
		currentPosition = 4;
		draw();
		displayShape();
	}
}

// Logic to stop shapes from breaking when pushed beyond edge
function moveLeft() {
	undraw();
	const leftEdge = current.some(
		(index) => (currentPosition + index) % width === 0
	);

	if (!leftEdge) currentPosition -= 1;

	if (
		current.some((index) =>
			blocksArray[currentPosition + index].classList.contains('landed')
		)
	) {
		currentPosition += 1;
	}
	draw();
}

function moveRight() {
	undraw();
	const rightEdge = current.some(
		(index) => (currentPosition + index + 1) % width === 0
	);

	if (!rightEdge) currentPosition += 1;

	if (
		current.some((index) =>
			blocksArray[currentPosition + index].classList.contains('landed')
		)
	) {
		currentPosition -= 1;
	}
	draw();
} 

function rotate() {
	undraw();
	currentRotation++;
	if(currentRotation === current.length) { //if the current rotation gets to 4, make it go back to 0
		currentRotation = 0;
	}
	current = randomShape[currentRotation];
	draw();
}

// show next block shape in mini-grid display
const displaySquares = document.querySelectorAll('.mini-grid div');
const displayWidth = 4;
let displayIndex = 0;

// blocks without rotations
const upNextShapes = [
	[1, width + 1, width * 2 + 1, 2], //lBlock
	[width + 1, width + 2, width * 2, width * 2 + 1], //zBlock
	[1, width, width + 1, width + 2], //tBlock
	[1, width + 1, width * 2 + 1, width * 3 + 1], //oBlock
	[1, width + 1, width * 2 + 1, width * 3 + 1] //iBlock
];

// display the shape in the mini-grid display
function displayShape() {
	// clear mini-grid of any previous shape displayed
	displaySquares.forEach(square => {
		square.classList.remove('shapeBlock');
	})
	upNextShapes[nextRandom].forEach(index => {
		displaySquares[displayIndex + index].classList.add('shapeBlock')
	})
}