import Vector from './Vector.js';
const PIXEL_RATIO = 1;
const GRID = {
    x: window.innerWidth / 80,
    y: window.innerHeight / 22
};

export default class Follower {
	constructor(x, y, ctx, master, radius, color, type /* isClock*/) {
        this.master = master;
        this.position = new Vector(x, y);
        this.ctx = ctx;
        this.radius = radius || 4;
        this.gridOrigin = new Vector(x, y);
        this.originalRadius = radius;
        this.color = color || 'rgb(70, 90, 150)';
        this.gridMotion = new Vector(0, 0);
        this.orientation = true;
        // console.log(this.originalRadius);
	}

	update() {
		this.radius = (this.originalRadius * PIXEL_RATIO) / 2;
		// check grid Origin
		// this.outside();
		let position = Vector.vector_sub(this.master.position, this.gridOrigin);
		const motion = this.orientation
			? Math.sin(position.heading()) * position.mag()
			: Math.cos(position.heading()) * position.mag();
		this.gridMotion.set(
			this.orientation ? this.gridOrigin.x : this.gridOrigin.x + motion,
			this.orientation ? this.gridOrigin.y + motion : this.gridOrigin.y
		);
		if ((this.orientation && Math.abs(motion) >= GRID.y) || (!this.orientation && Math.abs(motion) >= GRID.x)) {
			let diffx = 0;
			let diffy = 0;
			if (this.master.velocity.x >= 0) {
				diffx = GRID.x;
			} else {
				diffx = -GRID.x;
			}
			if (this.master.velocity.y >= 0) {
				diffy = GRID.y;
			} else {
				diffy = -GRID.y;
			}
			this.gridOrigin.add(this.orientation ? 0 : diffx, this.orientation ? diffy : 0);

			// this.outside();
			position = Vector.vector_sub(this.master.position, this.gridOrigin);
			if (
				Math.abs(Math.cos(position.heading()) * position.mag()) >
				Math.abs(Math.sin(position.heading()) * position.mag())
			) {
				this.orientation = false;
			} else {
				this.orientation = true;
			}
			this.gridMotion.set(
				this.orientation ? this.gridOrigin.x : this.gridOrigin.x + motion,
				this.orientation ? this.gridOrigin.y + motion : this.gridOrigin.y
			);
		}
	}

	draw() {
        // console.log('d');
		// console.log(this.position);
		this.ctx.fillStyle = this.color;
		this.ctx.save();
        // this.ctx.globalAlpha = 1;
        this.ctx.globalAlpha = this.equalizer ? 0.75 : 1;
        this.ctx.translate(
            this.position.lerp(this.gridMotion.x, this.gridMotion.y, 0.1).x,
            this.position.lerp(this.gridMotion.x, this.gridMotion.y, 0.1).y
        );
		
        this.ctx.beginPath();
        // console.log(this.radius);
		this.ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
		// if (this.isClock && this.position.dist(this.center) < this.limit_distance) {
		// 	this.ctx.strokeStyle = this.color;
		// 	this.ctx.stroke();
		// } else {
		this.ctx.fill();
		// }

		this.ctx.closePath();
		this.ctx.restore();
	}

	run() {
		this.update();
		this.draw();
	}
}
