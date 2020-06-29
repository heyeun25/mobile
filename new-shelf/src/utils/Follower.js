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
		const motion = Math.sin(position.heading()) * position.mag();
		if (this.master.id == 0) {
			console.log('motion', position.y, position.mag());
		}
		this.gridMotion.set(this.gridOrigin.x , this.gridOrigin.y + DeviceMotionEvent);
		if (Math.abs(motion)) {
			// let diffx = 0;
			// let diffy = 0;
			// if (this.master.velocity.x >= 0) {
			// 	diffx = GRID.x;
			// } else {
			// 	diffx = GRID.x;
			// }
			// if (this.master.velocity.y >= 0) {
			// 	diffy = 98
			// } else {
			// 	diffy = 98
			// }
			
			// this.gridOrigin.add(0, diffy);

			// this.outside();
			position = Vector.vector_sub(this.master.position, this.gridOrigin);
			
			this.gridMotion.set(
				this.gridOrigin.x,
				this.gridOrigin.y + motion
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
			// this.gridMotion.x,
			// this.gridMotion.y
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
