<template>
    <div class="equalizerWall-container">
        <button class="playBtn" v-on:click="playMusic">play</button>
        <div class="wall-container">
            <div v-for="(index) in itemCount"
                v-bind:key="index + 'item'"
                class="wall-item"
                ref="wallItem"></div>
        </div>
        <canvas class="shelfViewBg" ref="shelfViewBg"></canvas>
        <canvas class="shelfView" ref="shelfView"></canvas>
        <audio ref="music" src="../assets/audio/needed.mp3" controls></audio>
        
    </div>
</template>
<script>
import Vector from '../utils/Vector.js';
var analyser,
    dataArray,
    orderArray,
    parseArray,
    audioCtx,
    rAF;
const FRAME = 256, WALL_WIDTH = 15;
var shelfPosition = [
        [1336, 635, 784], // x0, y0, width
        [150, 1500, 1500],
        [1850, 1970, 710],
        [2746, 1756, 1000]
    ];

    var trapezoidWidth = [
        [260, 225, 174, 257],
        [240, 168, 250, 170, 158, 170, 166, 280, 240],
        [255, 176, 213, 220],
        [243, 260, 200, 250, 180]
    ];
    
function linear(x,t,b,c,d) {
    return b+c*x;
}

function map(val, minVal, maxVal, minOut, maxOut) {
  return (val-minVal)/(maxVal-minVal) * (maxOut-minOut) + minOut;
}

function getRandomArbitrary(min, max) {
    return (Math.random() * (max - min) + min).toFixed(1);
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //최댓값도 포함, 최솟값도 포함
}

function getHeight(xPoint, itemWidth) {
    var maxHeight = 400;
    return Math.sin(Math.PI / itemWidth * xPoint) * maxHeight;
}

export default {
    data() {
        return {
            itemCount: parseInt(innerWidth / WALL_WIDTH)-20,
            proceedData: [],
            upDown: [],
        }
    },
    methods: {
        playMusic: function() {
            console.log('play music');
            var audio = this.$refs.music;
            audio.play();
            audioCtx = new AudioContext();
            var src = audioCtx.createMediaElementSource(audio);
            analyser = audioCtx.createAnalyser();
            src.connect(analyser);
            analyser.connect(audioCtx.destination);
            analyser.fftSize = FRAME;

            var bufferLength = analyser.frequencyBinCount;
            console.log(bufferLength);
            dataArray = new Uint8Array(bufferLength);
            orderArray = new Array(this.itemCount);
            
            for(var i =0; i<orderArray.length; i++) {
                orderArray[i] = getRandomIntInclusive(0, dataArray.length-1);
            }
            this.start(this.equalizer);
        },
        start: function(equalizer) {
            var soundItems = this.$refs.wallItem;
            this.updateWay(dataArray.length);
            function animation() {
                if (analyser) {
                    analyser.getByteFrequencyData(dataArray);
                }
                equalizer(dataArray);
                rAF = requestAnimationFrame(animation);
            }
            animation();
        },
        ready() {

        },
        updateWay(length, index) {
            // console.log('updateWay', index);
            if (!this.way) {
                this.way = [];
                for(var i=0; i<length; i++) {
                    this.way[i] = 1;
                }
            }

            if (index) {
                this.way[index] *= -1;
            }
        },
        equalizer(audioData) {
            var tzCnt = 0;
            var count = trapezoidWidth.map((tz) => {
                tzCnt += tz.length;
            });
            if (!this.index) {
                this.index = [];
                for(var i =0; i<tzCnt; i++) {
                    // this.index.push(getRandomIntInclusive(0, audioData.length));
                    this.index.push(i);
                };
            }   
            
            this.proceedData = audioData.map((d, index) => {
                if (this.proceedData.length <= 0) {
                    return getRandomIntInclusive(0, 256);
                }
                
                // if (index == 0) {
                //     console.log(this.proceedData[index]);
                // }

                var result = 0;
                if (this.way[index]>0) {
                    result = this.proceedData[index] += 1;
                } else {
                    result = this.proceedData[index] -= 1;
                }

                if (this.proceedData[index] > 250 ||
                    this.proceedData[index] <= 0) {
                    this.updateWay(audioData.length, index);
                    // console.log('@@@this.way[index', this.way[index]);
                }
                return result;
            });
            // console.log(this.proceedData);
            var dataTzs = this.mapAudioToTrapezoid(this.allTzs, this.proceedData, this.index);
            this.drawTrapezoid(dataTzs, 0.86, 0.87);
        },
        drawTrapezoid(shelfs, x, y) {
            // console.log('dt');
            const mx = x || 1;
            const my = y || 1;

            var canvas = this.$refs.shelfView;
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            shelfs.map((trapezoids) => {
                trapezoids.map((t) => {
                    ctx.beginPath();
                    ctx.moveTo(t[0].x * mx, t[0].y * my);
                    ctx.lineTo(t[1].x * mx, t[1].y * my);
                    ctx.lineTo(t[2].x * mx, t[2].y * my);
                    ctx.lineTo(t[3].x * mx, t[3].y * my);
                    ctx.fillStyle = "white";
                    ctx.globalAlpha = 0.3;
                    ctx.fill();
                });
            });
        },
        drawShelf(data, resize) {
            console.log('drawShelf');
            var shelfs = resize(data);
            var canvas = this.$refs.shelfViewBg;
            var ctx = canvas.getContext('2d');

            ctx.beginPath();
            shelfs.map((shelf) => {
                ctx.moveTo(shelf[0], shelf[1]);
                ctx.lineTo(shelf[0] + shelf[2], shelf[1]);
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 8;
                ctx.stroke();
            });
        },
        createTrapezoid(shelf, items) { //shelf :[x0, y0, width], items :trapezoidWidth[n], data: sound
            let totalWidth = 0;
            const shelfX0 = shelf[0],
                shelfY0 = shelf[1],
                shelfWidth = shelf[2],
                shelfSideGap = 60;
            items.map((item) => {
                totalWidth += item;
            });
            totalWidth += shelfSideGap;

            let totalOverlap = (shelfWidth < totalWidth ? totalWidth-shelfWidth : 0);
            var overlap = (totalOverlap / (items.length-1));
            // console.log(parseInt(overlap), totalOverlap);

            function getYpoint(x) {
                const theta = ((Math.PI/shelfWidth)) * (x-shelfX0);
                return (Math.sin(theta))*200;
            }

            var p = 0 + shelfSideGap / 2;
            var xyPositions = items.map((item, index) => {
                let x1Gap = getRandomArbitrary(0.1, 0.3),
                    x2Gap = getRandomArbitrary(0.7, 0.9),
                    y1Gap = getRandomIntInclusive(0, 200),
                    y2Gap = y1Gap + getRandomIntInclusive(0, 30);

                let p0 = {x: p + shelfX0, y: shelfY0},
                    p1 = {x: p + shelfX0 + item * x1Gap, y: shelfY0 - getYpoint(p + shelfX0 + item * x1Gap) - y1Gap},
                    p2 = {x: p + shelfX0 + item * x2Gap, y: shelfY0 - getYpoint(p + shelfX0 + item * x2Gap) - y2Gap},
                    p3 = {x: p + shelfX0 + item, y: shelfY0};

                let ret = [p0, p1, p2, p3];
                p = p + item - overlap;
                // console.log('p', p);
                return ret;
            });
            console.log('xyPositions', xyPositions);
            return xyPositions;
        },
        applyData(trapezoid, val) { // trapezoid: 4 arr [x, y];
            var newTz = JSON.parse(JSON.stringify(trapezoid)); // clone
            var shelfY = trapezoid[0].y;
            newTz[1].y = shelfY - map(val, 0, 256,
                parseInt(Math.abs(trapezoid[1].y - shelfY) * 0),
                parseInt(Math.abs(trapezoid[1].y - shelfY) * 1));
            newTz[2].y = shelfY - map(val, 0, 256,
                parseInt(Math.abs(trapezoid[2].y - shelfY) * 0),
                parseInt(Math.abs(trapezoid[2].y - shelfY) * 1));
            return newTz;
        },
        mapAudioToTrapezoid(shelfs, audioData, index) {
            var i =0;
            var dataTrapezoids;
            return shelfs.map((trapezoids) => {
                return trapezoids.map((tz) => {
                    var d = audioData[index[i]];
                    var newTz = this.applyData(tz, d);
                    i++;
                    return newTz;
                });
            });
        },
        animateTrapezoid(shelfs, x, y) {
            // console.log('dt');
            const mx = x || 1;
            const my = y || 1;

            var canvas = this.$refs.shelfView;
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            var drawShelfs = shelfs.map((trapezoids) => {
                return trapezoids.map((t) => {
                    return [{x: t[0].x, y: t[0].y},
                            {x: t[1].x, y: t[0].y}, // 
                            {x: t[2].x, y: t[0].y}, //
                            {x: t[3].x, y: t[0].y}];
                });
            });

            console.log(drawShelfs);
            console.log('shelfs');
            console.log(shelfs);

            var that = this;
            function animation() {

                for(var i =0; i<drawShelfs.length; i++) {
                    var dTrapezoids = drawShelfs[i];
                    var sTrapezoids = shelfs[i];
                    for(var j =0; j<dTrapezoids.length; j++) {
                        var dt = dTrapezoids[j];
                        var st = sTrapezoids[j];
                        (dt[1].y < st[1].y ? dt[1].y++ : null)
                        
                        // console.log(dt[1].y, st[1].y);

                        if (dt[1].y > st[1].y) {
                            dt[1].y -= (dt[1].y - st[1].y) * 0.05;
                        }
                        if (dt[2].y > st[2].y) {
                            // console.log('aaa');
                            dt[2].y -= (dt[2].y - st[2].y) * 0.05;
                        }
                    }
                }
                that.drawTrapezoid(drawShelfs, x, y);
                rAF = requestAnimationFrame(animation);

            }
            animation();

            // shelfs.map((trapezoids) => {
            //     trapezoids.map((t) => {
            //         ctx.beginPath();
            //         ctx.moveTo(t[0].x * mx, t[0].y * my);
            //         ctx.lineTo(t[1].x * mx, t[1].y * my);
            //         ctx.lineTo(t[2].x * mx, t[2].y * my);
            //         ctx.lineTo(t[3].x * mx, t[3].y * my);
            //         ctx.fillStyle = "white";
            //         ctx.globalAlpha = 0.3;
            //         ctx.fill();
            //     });
            // });
        }
    },
    destroyed() {
        if (rAF) {
            cancelAnimationFrame(rAF);
            rAF = null;
        }
    },
    mounted() {
        console.log('mounted');
        var shelfViewBg = this.$refs.shelfViewBg;
        var shelfView = this.$refs.shelfView;
        shelfViewBg.width = shelfView.width = shelfViewBg.clientWidth;
        shelfViewBg.height = shelfView.height = shelfViewBg.clientHeight;

        function shelfResize(arr) {
            var ret = arr.map((val) => {
                return [
                    val[0] * 0.86, // x0,  
                    val[1] * 0.87, // y0,
                    val[2] * 0.86, // width
                ]
            });
            console.log(ret);
            return ret;
        }
        this.drawShelf(shelfPosition, shelfResize);

        var allTzs = [];
        shelfPosition.map((shelf, index) => {
            allTzs.push(this.createTrapezoid(shelf, trapezoidWidth[index]));
        });
        this.animateTrapezoid(allTzs, 0.86, 0.87);
        // this.drawTrapezoid(allTzs, 0.86, 0.87);
        this.allTzs = allTzs;
    }
}
</script>
<style>
.equalizerWall-container {
    width: 100%;
    height: 100%;
    background-color: white;
}

.equalizerWall-container > button {
    position: absolute;
    top: -20px;
}

.equalizerWall-container > audio {
    visibility: hidden;
}

.wall-container {
    position: absolute;
    left: 3px;
    width: 100%;
    height: 100%;
    background: #9e9068;
    
}

.wall-item {
    display: inline-block;
    /* flex: 1 16px; */
    width: 14px;
    /* flex-basis: 50px; */
    height: 100%;
    outline: 1px solid #605842;
    /* background: linear-gradient(to right, transparent 50%, #6b634b); */
    /* box-shadow: 6px 6px 10px #9d906d,  */
    box-shadow: -4px -4px 4px #736b51;
}

.shelfViewBg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}

.shelfView {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}
</style>


