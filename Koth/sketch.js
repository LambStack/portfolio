let hill = undefined;
let dudes = [];
let pointsDots = [];
let timer = 200;

function setup() {
	createCanvas(1280, 720);

	button = createButton('click me');
	button.position(19, 19);
	button.mousePressed(reset);

	hill = { x: width / 2, y: height / 2, radius: 150 };
	for (let i = 0; i < 4; i++) {
		let dude = new Dude(i);

		dudes.push(dude);

		// temporary skipping making dots to help train
		if (i === 1 || i === 2) {
			continue;
		}

		// creates dots that give points between the dudes and the circle
		// (attempt to lead them to the circle)
		let tempDots = [];

		class Dot {
			classname = 'Dot';
			radius = 5;
			constructor(x, y) {
				this.x = x;
				this.y = y;
				this.hidden = false;
			}
		}
		tempDots.push(
			new Dot(
				(dudes[i].location.x + hill.x) / 2,
				(dudes[i].location.y + hill.y) / 2,
			),
		);
		tempDots.push(
			new Dot(
				(dudes[i].location.x + tempDots[0].x) / 2,
				(dudes[i].location.y + tempDots[0].y) / 2,
			),
		);
		tempDots.push(
			new Dot((tempDots[0].x + hill.x) / 2, (tempDots[0].y + hill.y) / 2),
		);

		tempDots.push(
			new Dot(
				(dudes[i].location.x + tempDots[1].x) / 2,
				(dudes[i].location.y + tempDots[1].y) / 2,
			),
		);

		pointsDots.push(...tempDots);
	}

	for (let dude of dudes) {
		env = dude;

		var spec = {};
		spec.update = 'qlearn'; // qlearn | sarsa
		spec.gamma = 0.9; // discount factor, [0, 1)
		spec.epsilon = 0.2; // initial epsilon for epsilon-greedy policy, [0, 1)
		spec.alpha = 0.01; // value function learning rate
		spec.experience_add_every = 10; // number of time steps before we add another experience to replay memory
		spec.experience_size = 5000; // size of experience replay memory
		spec.learning_steps_per_iteration = 20;
		spec.tderror_clamp = 1.0; // for robustness
		spec.num_hidden_units = 100; // number of neurons in hidden layer

		//agent = new RL.ActorCritic(env, spec);
		agent = new RL.DQNAgent(env, spec);
		//agent = new RL.RecurrentReinforceAgent(env, {});

		agent.epsilon = 20;
	}
}

function reset() {
	pointsDots = [];

	for (let i = 0; i < dudes.length; i++) {
		let dude = dudes[i];
		dude.location.x = dude.spawnLocation.x;
		dude.location.y = dude.spawnLocation.y;
		dude.score = 0;

		// temporary skipping making dots to help train
		if (i === 1 || i === 2) {
			continue;
		}

		// creates dots that give points between the dudes and the circle
		// (attempt to lead them to the circle)
		let tempDots = [];

		class Dot {
			classname = 'Dot';
			radius = 5;
			constructor(x, y) {
				this.x = x;
				this.y = y;
				this.hidden = false;
			}
		}
		tempDots.push(
			new Dot((dude.location.x + hill.x) / 2, (dude.location.y + hill.y) / 2),
		);
		tempDots.push(
			new Dot(
				(dude.location.x + tempDots[0].x) / 2,
				(dude.location.y + tempDots[0].y) / 2,
			),
		);
		tempDots.push(
			new Dot((tempDots[0].x + hill.x) / 2, (tempDots[0].y + hill.y) / 2),
		);

		tempDots.push(
			new Dot(
				(dude.location.x + tempDots[1].x) / 2,
				(dude.location.y + tempDots[1].y) / 2,
			),
		);

		pointsDots.push(...tempDots);
	}
}
//game loop
function draw() {
	if (frameCount % 60 == 0 && timer > 0) {
		// if the frameCount is divisible by 60, then a second has passed. it will stop at 0
		timer--;
	}

	background(230, 230, 250);
	fill(255);
	stroke(6);
	strokeWeight(6);
	circle(hill.x, hill.y, hill.radius);
	textAlign(CENTER, TOP);
	noStroke();
	textSize(32);
	text(timer, width / 2, 0);

	if (timer <= 0) {
		fill(0);
		textAlign(CENTER, CENTER);

		text('GAME OVER', width / 2, height / 2);
		noLoop();
	}

	for (let dude of dudes) {
		dude.visableObjects = [];
		let visableObjects = [];
		if (dude.isDead) {
			continue;
		}
		dude.think();
		//check collision and score points
		if (
			collideRectCircle(
				dude.location.x,
				dude.location.y,
				dude.SIZE,
				dude.SIZE,
				hill.x,
				hill.y,
				hill.radius * 2,
			)
		) {
			stroke(dude.color);
			circle(hill.x, hill.y, hill.radius);
			dude.score += 0.03;
		}

		for (let dot of pointsDots) {
			if (!dot.hidden) {
				if (
					collideRectCircle(
						dude.location.x,
						dude.location.y,
						dude.SIZE,
						dude.SIZE,
						dot.x,
						dot.y,
						dot.radius * 2,
					)
				) {
					dude.score += 5;
					dot.hidden = true;
				}

				if (
					true
					// collideRectCircle(
					// 	dude.location.x,
					// 	dude.location.y,
					// 	dude.boxSize,
					// 	dude.boxSize,
					// 	dot.x,
					// 	dot.y,
					// 	dot.radius * 2,
					// )
				) {
					visableObjects.push(dot);
				}
			}
		}

		for (let otherDude of dudes) {
			if (otherDude !== dude) {
				if (
					true
					// collideRectRect(
					// 	dude.location.x,
					// 	dude.location.y,
					// 	dude.boxSize,
					// 	dude.boxSize,
					// 	otherDude.location.x,
					// 	otherDude.location.y,
					// 	otherDude.SIZE,
					// 	otherDude.SIZE,
					// )
				) {
					visableObjects.push(otherDude);
				}
			}
		}
		dude.visableObjects.push(...visableObjects);
		dude.learn();
		dude.show();
	}

	for (let dot of pointsDots) {
		if (!dot.hidden) {
			fill(138, 43, 226); // a nice purple
			circle(dot.x, dot.y, dot.radius);

			for (let dude of dudes) {
				if (
					collideRectCircle(
						dude.location.x,
						dude.location.y,
						dude.SIZE,
						dude.SIZE,
						dot.x,
						dot.y,
						dot.radius * 2,
					)
				) {
					dude.score += 5;
					dot.hidden = true;
				}
			}
		}
	}
}
let accel = 1;
function keyPressed() {
	if (keyCode === LEFT_ARROW) {
		dudes[0].stopH();
		dudes[0].moveH(-accel);
	} else if (keyCode === RIGHT_ARROW) {
		dudes[0].stopH();
		dudes[0].moveH(accel);
	} else if (keyCode === UP_ARROW) {
		dudes[0].stopV();
		dudes[0].moveV(-accel);
	} else if (keyCode === DOWN_ARROW) {
		dudes[0].stopV();
		dudes[0].moveV(accel);
	} else if (keyCode === 32) {
		dudes[0].explode(dudes);
	} else if (keyCode === 70) {
		dudes[0].blip();
	}
}

function keyReleased() {
	if (keyCode === LEFT_ARROW) {
		dudes[0].stopH();
		if (keyIsDown(RIGHT_ARROW)) {
			dudes[0].moveH(accel);
		}
	} else if (keyCode === RIGHT_ARROW) {
		dudes[0].stopH();
		if (keyIsDown(LEFT_ARROW)) {
			dudes[0].moveH(-accel);
		}
	} else if (keyCode === UP_ARROW) {
		dudes[0].stopV();
		if (keyIsDown(DOWN_ARROW)) {
			dudes[0].moveV(accel);
		}
	} else if (keyCode === DOWN_ARROW) {
		dudes[0].stopV();
		if (keyIsDown(UP_ARROW)) {
			dudes[0].moveV(-accel);
		}
	}
}
