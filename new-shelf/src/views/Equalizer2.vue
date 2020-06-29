<template>
    <div class="equalizer2-container">
        <canvas id="equalizer2" ref="equalizer2"></canvas>
        <audio ref="music" src="@/assets/audio/needed.mp3" controls></audio>
    </div>
</template>
<script>
import AudioTool from '@/utils/AudioTool.js';
import Boid from '@/utils/Boid.js';
import Follower from '@/utils/Follower.js';

const COLS = 80, ROWS = 22;
export default {
    construct() {
    },
    methods: {
        setup() {
            this.boids = [];
            this.followers = [];
            this.sizeW = this.w / COLS;
            this.sizeH = this.h / ROWS;
            // this.initBoids();
            this.draw();
        },
        draw() {
            this.ctx.fillStyle = 'darkgreen';
            this.ctx.fillRect(0, 0, this.w, this.h);

            for(let i =0; i<this.boids.length; i++) {
                this.boids[i].run();
            }
            for(let i =0; i<this.followers.length; i++) {
                this.followers[i].run();
            }
            if (this.tool) {
                this.tool.updateWave();
                this.tool.updateFrequency();
            }
            requestAnimationFrame(this.draw.bind(this));
        },
        initBoids(max, initPos, r) { // max is circle max count
            if (this.tool) {
                this.tool.reset();
                document.body.removeChild(this.tool.audio);
                this.tool = null;
            }
            this.tool = new AudioTool(this.$refs.music);
            this.tool.toggle();
            this.boids = [];
            this.followers = [];

            for(let i=0; i<max; i++) {
                initPos = this.getPointByIndex(i, max);
                const boid = new Boid(
                    this,
                    initPos.x * this.sizeW,
                    initPos.y * this.sizeH,
                    this.ctx
                );
                boid.id = i;
                boid.max = max;
                this.boids.push(boid);
                // console.log(boid, r);
                this.followers.push(new Follower(
                    initPos.x * this.sizeW,
                    initPos.y * this.sizeH,
                    this.ctx,
                    boid,
                    r,
                    'red'
                ));

            }
        },
        shuffle(a) {
            var j, x, i;
            for (i = a.length-1; i>0; i--) {
                j = Math.floor(Math.random() * (i+1));
                x = a[i];
                a[i] = a[j];
                a[j] = x;
            }
            return a;
        },
        getPointByIndex(x, max) {
            if (!this.random) {
                this.random = [];
                // cols = 80 / rows = 22
                console.log(max/COLS);
                for(let i=0; i<max; i++) {
                    var amountByPoint = max / COLS;
                    console.log(amountByPoint);
                    this.random.push({
                        x: Math.floor(i / amountByPoint),
                        y: -1
                    });
                    // this.shuffle(this.random);

                }
                console.log(this.random);
            }
            return this.random[x];
        },
        start() {
            console.log('start');
            this.initBoids(100, {x: COLS/2, y: ROWS/2}, 8);
        }
    },
    mounted() {
        this.canvas = this.$refs.equalizer2;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.width = this.w = window.innerWidth;
        this.canvas.style.height = this.h = window.innerHeight;
        this.ctx = this.canvas.getContext('2d');
        this.setup();
        // this.start();
        document.addEventListener('keydown', this.start);
    },
}
</script>
<style>
.equalizer2-container > .st {
    position: absolute;
    top: 0;
    left: 0;
    width: 200px;
    height: 200px;
    font-size: 200px;
}

.equalizer2-conteinr > canvas {
    position: absolute;
    top: 0;
    left: 0;
}

/* audio {
    position: absolute;
    top: 0;
    left: 0;s
} */
</style>
