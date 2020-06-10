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
var analyser,
    dataArray,
    orderArray,
    parseArray,
    audioCtx,
    rAF;
const FRAME = 256, WALL_WIDTH = 15;
function linear(x,t,b,c,d) {
    return b+c*x;
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

function map(val, minVal, maxVal, minOut, maxOut) {
  return (val-minVal)/(maxVal-minVal) * (maxOut-minOut) + minOut;
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
                orderArray[i] = getRandomInt(0, dataArray.length-1);
            }
            this.start(this.drawTrapezoid);
        },
        start: function(equalizer) {
                var soundItems = this.$refs.wallItem;
                // const topShadow = '#9d906d',
                    //   bottomShadow = '#71694f';
                
                function animation() {
                    if (analyser) {
                        analyser.getByteFrequencyData(dataArray);
                    }


                    equalizer(dataArray[20]);

                    // for(var i =0; i<orderArray.length; i++) {
                    //     var c = dataArray[orderArray[i]];
                    //     var shadowVal = Math.round(linear(c/FRAME, c, -8, 28, FRAME));
                    //     if (shadowVal > 0) {
                    //         soundItems[i].style.boxShadow = `${shadowVal}px ${shadowVal}px ${shadowVal+5}px ${topShadow},
                    //                 -${shadowVal}px -${shadowVal}px ${shadowVal+5}px ${bottomShadow}`;
                    //     } else {
                    //         shadowVal = Math.abs(shadowVal);
                    //         soundItems[i].style.boxShadow = `inset ${shadowVal}px ${shadowVal}px ${shadowVal}px ${topShadow},
                    //                 inset -${shadowVal}px -${shadowVal}px ${shadowVal}px ${bottomShadow}`
                    //     }
                    // }

                    rAF = requestAnimationFrame(animation);
                }
                animation();
            },
            ready() {

            },
            drawTrapezoid(data) {
                var d = map(data, 0, 256, 0, 300);
                console.log(data, parseInt(d));
                var canvas = this.$refs.shelfView;
                var ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.beginPath();

                var st = [200, 300]; // static
                var sideGap = 30; // static
                var center = 150; // static

                var topGap = 20; // ramdom
                var height = d; // ramdom

                ctx.moveTo(st[0], st[1]);
                ctx.lineTo(st[0] + sideGap, st[1] - height);
                ctx.lineTo(st[0] + sideGap + center, st[1] - height + topGap);
                ctx.lineTo(st[0] + sideGap*2 + center, st[1]);
                ctx.fillStyle = "white";
                // ctx.stroke();
                ctx.globalAlpha = 0.3;
                ctx.fill();
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

        var shelfs = [
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
        ]

        function resize(arr) {
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

        function createTrapezoid(shelf, items) {
            let totalWidth = 0;
            items.map((item) => {
                // console.log(item);
                totalWidth += item;
            });
            let totalOverlap = (shelf[2] < totalWidth ? totalWidth-shelf[2] : 0);
            var overlap = (totalOverlap / (items.length-1));
            console.log(parseInt(overlap), totalOverlap);
            // console.log('overlap', totalWidth, overlap);

            var p = 0;
            var xyPositions = items.map((item, index) => {
                return {

                }
            });

        }
        this.drawShelf(shelfs, resize);
        shelfs.map((shelf, index) => {
            createTrapezoid(shelf, trapezoidWidth[index]);
        });
        this.drawTrapezoid();
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


