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
            var dataTzs = this.mapAudioToTrapezoid(this.allTzs, audioData, this.index);
            console.log(dataTzs[0]);
            this.drawTrapezoid(dataTzs, 0.86, 0.87);
        },
        drawTrapezoid(shelfs, x, y) {
            console.log('dt');
            const mx = x || 1;
            const my = y || 1;
            // console.log(mx, my);

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
            })
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
            console.log(parseInt(overlap), totalOverlap);

            var p = 0 + shelfSideGap / 2;
            var xyPositions = items.map((item, index) => {
                let x1Gap = getRandomArbitrary(0.1, 0.4),
                    x2Gap = getRandomArbitrary(0.7, 0.9),
                    y1Gap = getRandomIntInclusive(30, 400),
                    y2Gap = getRandomIntInclusive(y1Gap - 10, 300);
                let ret = [
                    {x: p + shelfX0, y: shelfY0},
                    {x: p + shelfX0 + item * x1Gap, y: shelfY0 - y1Gap},
                    {x: p + shelfX0 + item * x2Gap, y: shelfY0 - y2Gap},
                    {x: p + shelfX0 + item, y: shelfY0}
                ];
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
            var y1 = newTz[1].y,
                y2 = newTz[2].y;
            var absY1 = Math.abs(shelfY - y1), 
                absY2 = Math.abs(shelfY - y2);
            var minIndex = absY1 < absY2 ? 1 : 2,
                maxIndex = absY1 < absY2 ? 2 : 1;

            var newY = map(val, 0, 256, 0, Math.abs(trapezoid[minIndex].y - shelfY) * 0.3);
            // console.log('newY', newY);

            newTz[minIndex].y = shelfY - newY;
            newTz[maxIndex].y = shelfY - newY;
            // console.log('newTz', newTz);
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
        this.drawTrapezoid(allTzs, 0.86, 0.87);
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


