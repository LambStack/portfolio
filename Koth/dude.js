class Dude {
	SIZE = 35;
	spawnLocations = [
		{ x: 0, y: 0 },
		{ x: 0, y: height - this.SIZE },
		{ x: width - this.SIZE, y: 0 },
		{ x: width - this.SIZE, y: height - this.SIZE },
	];
	classname = 'Dude';

	//ml stuff

	learn = function () {
		var steps_per_tick = 1;
		var action, state;
		var smooth_reward = null;
		var flott = 0;
		for (var k = 0; k < steps_per_tick; k++) {
			state = env.getState();
			action = agent.act(state);
			var obs = env.think(action);
			agent.learn(obs.r);
			if (smooth_reward == null) {
				smooth_reward = obs.r;
			}
			smooth_reward = smooth_reward * 0.999 + obs.r * 0.001;
			flott += 1;
		}
	};

	getNumStates = function () {
		return 11; //x,y,vx,vy, x∆dot, y∆dot, x∆dude, y∆dude, x∆hill, y∆hill, dead
	};
	getMaxNumActions = function () {
		return 5; //up, down, left, right, nothing, blip, explode
	};
	getState = function () {
		this.look();
		var s = [
			this.location.x,
			this.location.y,
			this.velocity.x,
			this.velocity,
			this.sensors.xDistToCenter,
			this.sensors.yDistToCenter,
			this.sensors.xDistNearestDot,
			this.sensors.yDistNearestDot,
			this.sensors.xDistNearestDude,
			this.sensors.yDistNearestDude,
			this.isDead,
		];
		return s;
	};

	// end ml stuff
	constructor(x) {
		this.score = 0;
		this.oldScore = 0;
		this.spawnLocation = this.spawnLocations[x];
		this.location = { x: 0, y: 0 };
		this.location.x = this.spawnLocation.x;
		this.location.y = this.spawnLocation.y;

		//cutting off at 200 so I don't get white
		this.color = color(random() * 200, random() * 200, random() * 200);
		this.velocity = { x: 0, y: 0 };
		this.acceleration = { x: 0, y: 0 };
		this.playerControlled = x === 0;
		this.boxSize = 5 * this.SIZE;
		this.isDead = x === 1 || x === 2;

		this.visibleObjects = [];

		this.sensors = {
			xDistToCenter: 0,
			yDistToCenter: 0,
			xDistNearestDot: 0,
			yDistNearestDot: 0,
			xDistNearestDude: 0,
			yDistNearestDude: 0,
			numDotsVisible: 0,
			numDudesVisible: 0,
		};
	}

	show = function () {
		fill(this.color);
		noStroke();
		square(this.location.x, this.location.y, this.SIZE);

		stroke('gray');
		strokeWeight(1);
		noFill();
		square(
			this.location.x - this.boxSize / 2 + this.SIZE / 2,
			this.location.y - this.boxSize / 2 + this.SIZE / 2,
			this.boxSize,
		);

		fill(255);
		textAlign(CENTER, CENTER);
		textSize(16);
		text(
			Math.floor(this.score),
			this.location.x + this.SIZE / 2,
			this.location.y + this.SIZE / 2,
		);
	};

	look = function () {
		this.sensors.xDistToCenter = width / 2 - this.location.x;
		this.sensors.yDistToCenter = height / 2 - this.location.y;

		this.sensors.numDudesVisible = 0;
		this.sensors.numDotsVisible = 0;

		let closestDudeDistance = Infinity;
		let closestDotDistance = Infinity;

		for (let i = 0; i < this.visibleObjects.length; i++) {
			if (this.visibleObjects[i].classname === 'Dude') {
				this.sensors.numDudesVisible += 1;
				let distanceToDude = Math.hypot(
					this.visibleObjects[i].location.x - this.location.x,
					this.visibleObjects[i].location.y - this.location.y,
				);
				if (closestDudeDistance > distanceToDude) {
					closestDudeDistance = distanceToDude;
					this.sensors.xDistNearestDude =
						this.visibleObjects[i].location.x - this.location.x;
					this.sensors.yDistNearestDude =
						this.location.y - this.visibleObjects[i].location.y;
				}
			}
			if (this.visibleObjects[i].classname === 'Dot') {
				this.sensors.numDotsVisible += 1;
				let distanceToDot = Math.hypot(
					this.visibleObjects[i].x - this.location.x,
					this.visibleObjects[i].y - this.location.y,
				);
				if (closestDotDistance > distanceToDot) {
					closestDotDistance = distanceToDot;
					this.sensors.xDistNearestDot =
						this.visibleObjects[i].x - this.location.x;
					this.sensors.yDistNearestDot =
						this.location.y - this.visibleObjects[i].y;
				}
			}
		}
	};

	think = function (action) {
		if (this.isDead) {
			return { ns: this.getState(), r: 0 };
		}
		if (this.velocity.x > 5) {
			this.velocity.x = 5;
		}
		if (this.velocity.y > 5) {
			this.velocity.y = 5;
		}
		this.location.x += this.velocity.x;
		this.location.y += this.velocity.y;

		if (this.location.x < 0) {
			this.location.x = 0;
		} else if (this.location.x > width - this.SIZE) {
			this.location.x = width - this.SIZE;
		}

		if (this.location.y < 0) {
			this.location.y = 0;
		} else if (this.location.y > height - this.SIZE) {
			this.location.y = height - this.SIZE;
		}

		// if (this.score > 90) {
		// 	this.boxSize = this.SIZE * 1;
		// } else if (this.score > 80) {
		// 	this.boxSize = this.SIZE * 1.5;
		// } else if (this.score > 70) {
		// 	this.boxSize = this.SIZE * 2;
		// } else if (this.score > 60) {
		// 	this.boxSize = this.SIZE * 2.5;
		// } else if (this.score > 50) {
		// 	this.boxSize = this.SIZE * 3;
		// } else if (this.score > 40) {
		// 	this.boxSize = this.SIZE * 3.5;
		// } else if (this.score > 30) {
		// 	this.boxSize = this.SIZE * 4;
		// } else if (this.score > 20) {
		// 	this.boxSize = this.SIZE * 4.5;
		// }

		if (!this.playerControlled) {
			if (action === 0) {
				this.velocity.x = -5;
				console.log('left');
			}
			if (action === 1) {
				this.velocity.x = 5;
				console.log('right');
			}
			if (action === 2) {
				this.velocity.y = -5;
				console.log('up');
			}
			if (action === 3) {
				this.velocity.y = 5;
				console.log('down');
			}
			// if (action === 4) {
			// 	this.explode(dudes);
			// 	console.log('explode');
			// }
			// if (action === 5) {
			// 	this.blip();
			// 	console.log('blip');
			// }
		}

		return { ns: this.getState(), r: this.score };
	};

	moveH = function (x) {
		this.velocity.x += x;
	};
	moveV = function (y) {
		this.velocity.y += y;
	};

	stopH = function () {
		this.velocity.x = 0;
	};
	stopV = function () {
		this.velocity.y = 0;
	};
	explode = function (dudes) {
		if (this.isDead) {
			return;
		}
		this.kill(1000);
		this.score -= 1;
		for (let dude of dudes) {
			if (dude === this || dude.isDead) {
				continue;
			}

			if (
				collideRectRect(
					this.location.x,
					this.location.y,
					this.boxSize,
					this.boxSize,
					dude.location.x,
					dude.location.y,
					dude.SIZE,
					dude.SIZE,
				)
			) {
				dude.score -= 10;
				this.score += 10;
				dude.kill(5000);
			}
		}
	};

	kill = function (timeout) {
		let dude = this;
		dude.isDead = true;

		setTimeout(function () {
			dude.location.x = dude.spawnLocation.x;
			dude.location.y = dude.spawnLocation.y;
			dude.isDead = false;
		}, timeout);
	};

	blip = function () {
		if (this.isDead) {
			return;
		}
		let dude = this;
		this.isDead = true;

		setTimeout(function () {
			dude.isDead = false;
		}, 500);
	};
}
