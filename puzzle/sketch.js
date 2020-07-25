let tiles = [];
let solvedTiles = [];
let tileWidth = 0;
let tileHeight = 0;
let rowSize = 0;
let lastClickedIndex = 8;

function preload() {
	solvedTiles.push({ id: 1, img: loadImage('images/one.png') });
	solvedTiles.push({ id: 2, img: loadImage('images/two.png') });
	solvedTiles.push({ id: 3, img: loadImage('images/three.png') });
	solvedTiles.push({ id: 4, img: loadImage('images/four.png') });
	solvedTiles.push({ id: 5, img: loadImage('images/five.png') });
	solvedTiles.push({ id: 6, img: loadImage('images/six.png') });
	solvedTiles.push({ id: 7, img: loadImage('images/seven.png') });
	solvedTiles.push({ id: 8, img: loadImage('images/eight.png') });
	tiles = [...solvedTiles];
	shuffleArray(tiles);
	solvedTiles.push({ id: 9, img: loadImage('images/nine.png') });
	tiles.push(solvedTiles[8]);
}

function setup() {
	createCanvas(1280, 720);
	stroke('blue');
	strokeWeight(7);
	noFill();
	rowSize = Math.sqrt(tiles.length);
	tileWidth = width / rowSize;
	tileHeight = height / rowSize;
}

function draw() {
	if (equal(tiles, solvedTiles)) {
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
	let clickedIndex =
		Math.floor(mouseX / tileWidth) + Math.floor(mouseY / tileHeight) * rowSize;
	console.log(clickedIndex);
	let temp = tiles[lastClickedIndex];
	console.log(temp);
	tiles[lastClickedIndex] = tiles[clickedIndex];
	tiles[clickedIndex] = temp;
	console.log(tiles);
	//lastClickedIndex = -1;
	lastClickedIndex = clickedIndex;
}

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
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
