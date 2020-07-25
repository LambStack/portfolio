let tiles = [];
let solvedTiles = [];
let tileWidth = 0;
let tileHeight = 0;
let rowSize = 3;
let lastClickedIndex = 8;
let puzzleImage;
let gameStarted = false;
let backUpImage;

function preload() {
	backUpImage = loadImage('images/image.jpg');
}
function fileToGrid() {
	const selectedFile = document.getElementById('upload');
	const myImageFile = selectedFile.files[0];
	let urlOfImageFile = URL.createObjectURL(myImageFile);
	puzzleImage = loadImage(urlOfImageFile, () => {
		doStuff();
	});
}

function backup() {
	puzzleImage = backUpImage;
	doStuff();
}

function setup() {
	createCanvas(1280, 720);
	stroke('gray');
	strokeWeight(2);
	noFill();
	tileWidth = width / rowSize;
	tileHeight = height / rowSize;
}

function doStuff() {
	image(puzzleImage, 0, 0, width, height);

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

let id = 0;
function shuffleTiles() {
	clearInterval(id);

	let n = 0;
	id = setInterval(function () {
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
