let tiles = [];
let solvedTiles = [];
let tileWidth = 0;
let tileHeight = 0;
let rowSize = 3;
let lastClickedIndex = 8;
let puzzleImage;
let gameStarted = false;

function preload() {
	puzzleImage = loadImage('images/image.jpg');
}

function setup() {
	createCanvas(1280, 720);
	stroke('gray');
	strokeWeight(2);
	noFill();
	tileWidth = width / rowSize;
	tileHeight = height / rowSize;

	image(puzzleImage, 0, 0);
	for (let i = 0; i < rowSize * rowSize - 1; i++) {
		solvedTiles.push({
			id: i,
			img: get(
				tileWidth * (i % rowSize),
				tileHeight * Math.floor(i / rowSize),
				tileWidth,
				tileHeight,
			),
		});
	}

	tiles = [...solvedTiles];
	//shuffleArray(tiles);
	solvedTiles.push({ id: 8, img: loadImage('images/nine.png') });
	tiles.push(solvedTiles[8]);
	shuffleTiles();
}

function draw() {
	if (equal(tiles, solvedTiles) && gameStarted) {
		noLoop();
		setTimeout(function () {
			alert('You win!');
		}, 500);
	}
	background(230, 230, 250);
	for (let i = 0; i < tiles.length; i++) {
		image(
			tiles[i].img,
			tileWidth * (i % rowSize),
			tileHeight * Math.floor(i / rowSize),
			tileWidth,
			tileHeight,
		);
	}
	if (lastClickedIndex != -1) {
		rect(
			tileWidth * (lastClickedIndex % rowSize),
			tileHeight * Math.floor(lastClickedIndex / rowSize),
			tileWidth,
			tileHeight,
		);
	}
}

function mouseClicked() {
	handleClick(mouseX, mouseY);
}

function handleClick(x, y) {
	let clickedX = Math.floor(x / tileWidth);
	let clickedY = Math.floor(y / tileHeight);
	let clickedIndex = clickedX + clickedY * rowSize;

	let lastX = lastClickedIndex % rowSize;
	let lastY = Math.floor(lastClickedIndex / rowSize);

	let diffX = Math.abs(clickedX - lastX);
	let diffY = Math.abs(clickedY - lastY);

	if ((diffX === 1 || diffY === 1) && (diffX === 0 || diffY === 0)) {
		let temp = tiles[lastClickedIndex];
		tiles[lastClickedIndex] = tiles[clickedIndex];
		tiles[clickedIndex] = temp;
		lastClickedIndex = clickedIndex;
	}
}
// function shuffleArray(array) {
// 	for (let i = array.length - 1; i > 0; i--) {
// 		const j = Math.floor(Math.random() * (i + 1));
// 		[array[i], array[j]] = [array[j], array[i]];
// 	}
// }

function shuffleTiles() {
	let n = 0;
	let id = setInterval(function () {
		if (n++ < 1000) {
			handleClick(random() * width, random() * height);
		} else {
			clearInterval(id);
			gameStarted = true;
		}
	}, 10);
}

function equal(arr1, arr2) {
	if (arr1.length !== arr2.length) {
		return false;
	}
	for (let i = 0; i < arr1.length; i++) {
		if (arr1[i].id !== arr2[i].id) {
			return false;
		}
	}
	return true;
}
