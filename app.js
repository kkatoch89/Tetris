document.addEventListener('DOMContentLoaded', () => {
	const grid = document.querySelector('.grid');
	let blocks = Array.from(document.querySelectorAll('.grid div'));
	const startBtn = document.querySelector('#startBtn');
	const scoreDisplay = document.querySelector('#score');
	const width = 10;
	let score = 0;
	let nextRandom = 0;
	let timerId;

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
	const randomPicker = () => Math.floor(Math.random() * blockShapes.length);
	let randomShape = blockShapes[randomPicker()];
	let current = randomShape[currentRotation];

	// Drawing the shapes
	function draw() {
		current.forEach((index) => {
			blocks[currentPosition + index].classList.add('shapeBlock');
		});
	}

	// Undraw the shape
	function undraw() {
		current.forEach((index) => {
			blocks[currentPosition + index].classList.remove('shapeBlock');
		});
	}

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
				blocks[currentPosition + index + width].classList.contains('landed')
			)
		) {
			current.forEach((index) =>
				blocks[currentPosition + index].classList.add('landed')
			);
			// New shape falling
			randomShape = blockShapes[nextRandom];
			nextRandom = randomPicker();
			current = randomShape[currentRotation];
			currentPosition = 4;
			draw();
			displayShape();
			addScore();
			gameOver();
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
				blocks[currentPosition + index].classList.contains('landed')
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
				blocks[currentPosition + index].classList.contains('landed')
			)
		) {
			currentPosition -= 1;
		}
		draw();
	}

	function rotate() {
		// block rotation if the next rotation creates a situation where some of the blocks are
		// both on the right AND left edge. This would indicate that the shape was too long and it teleported to other
		// edge of grid as a result
		undraw();
		const prevRotation = currentRotation;
		currentRotation++;

		if (currentRotation === current.length) {
			//if the current rotation gets to 4, make it go back to 0
			currentRotation = 0;
		}

		current = randomShape[currentRotation];

		let rEdge = false;
		let lEdge = false;

		current.forEach((index) => {
			if ((currentPosition + index) % width === 0) {
				lEdge = true;
			} else if ((currentPosition + index + 1) % width === 0) {
				rEdge = true;
			}
		});

		currentRotation = rEdge && lEdge ? prevRotation : currentRotation;

		current = randomShape[currentRotation];
		draw();
	}

	// show next block shape in mini-grid display
	const displaySquares = document.querySelectorAll('.miniGrid div');
	const displayWidth = 5;
	let displayIndex = displayWidth + 1;

	// blocks without rotations
	const upNextShapes = [
		[1, displayWidth + 1, displayWidth * 2 + 1, 2], //lBlock
		[
			displayWidth + 1,
			displayWidth + 2,
			displayWidth * 2,
			displayWidth * 2 + 1,
		], //zBlock
		[1, displayWidth, displayWidth + 1, displayWidth + 2], //tBlock
		[0, 1, displayWidth, displayWidth + 1], //oBlock
		[1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iBlock
	];

	// display the shape in the mini-grid display
	function displayShape() {
		// clear mini-grid of any previous shape displayed
		displaySquares.forEach((square) => {
			square.classList.remove('shapeBlock');
		});
		upNextShapes[nextRandom].forEach((index) => {
			displaySquares[displayIndex + index].classList.add('shapeBlock');
		});
	}

	// Adding functionality to button
	startBtn.addEventListener('click', () => {
		if (timerId) {
			clearInterval(timerId);
			timerId = null;
		} else {
			draw();
			timerId = setInterval(moveDown, 1000);
			nextRandom = randomPicker();
			displayShape();
		}
	});

	// Add score
	function addScore() {
		for (let i = 0; i < 199; i += width) {
			const row = [
				i,
				i + 1,
				i + 2,
				i + 3,
				i + 4,
				i + 5,
				i + 6,
				i + 7,
				i + 8,
				i + 9,
			];

			if (row.every((index) => blocks[index].classList.contains('landed'))) {
				score += 10;
				scoreDisplay.innerHTML = score;
				row.forEach((index) => {
					blocks[index].classList.remove('landed');
					blocks[index].classList.remove('shapeBlock');
				});
				const blocksRemoved = blocks.splice(i, width);
				blocks = blocksRemoved.concat(blocks);
				blocks.forEach((cell) => grid.appendChild(cell));
			}
		}
	}

	// Game over
	function gameOver() {
		if (
			current.some((index) =>
				blocks[currentPosition + index].classList.contains('landed')
			)
		) {
			scoreDisplay.innerHTML = 'GAME OVER!';
			clearInterval(timerId)
		}
	}
});

