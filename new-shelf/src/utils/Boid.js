import Vector from './Vector.js';

export default class Boid {
    constructor(scope, x, y, ctx, grid, type) {
        this.scope = scope;
        const angle = Math.random() * Math.PI * 2;
        this.origin = new Vector(x, y);
		this.position = new Vector(x, y);
        this.velocity = new Vector(Math.cos(angle), Math.sin(angle));
        this.id = 0;
        this.max = 0;
    }
    run() {
		if (this.scope.tool != null) {
            // console.log('r');
			const range = Math.floor(this.scope.tool.data.length / this.max);
			const py = this.scope.tool.data[this.id * range] * 8;
            this.position.y = py;
            // if (this.id==0) {
            //     console.log('run', py);
            // }
		}
	}
}