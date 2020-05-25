<template>
    <div class="equalizerWall-container">
        <button class="playBtn" v-on:click="playMusic">play</button>
        <div class="wall-container">
            <div v-for="(index) in itemCount"
                v-bind:key="index + 'item'"
                class="wall-item"
                ref="wallItem"></div>
        </div>
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
const FRAME = 256;
function linear(x,t,b,c,d) {
    return b+c*x;
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

export default {
    data() {
        return {
            // itemCount: parseInt(3321 / 16)-2, // full width is 3321px
            itemCount: 30,
        }
    },
    methods: {
        // shuffle: function(a) {
        //     var j, x, i;
        //     for (i = a.length; i; i -= 1) {
        //         j = Math.floor(Math.random() * i); 
        //         x = a[i - 1]; 
        //         a[i - 1] = a[j]; 
        //         a[j] = x;
        //     }
        // },
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
            this.start();
        },
        start: function() {
                var soundItems = this.$refs.wallItem;
                const topShadow = '#9d906d',
                      bottomShadow = '#71694f';
                function animation() {
                    if (analyser) {
                        analyser.getByteFrequencyData(dataArray);
                    }
                    for(var i =0; i<orderArray.length; i++) {
                        var c = dataArray[orderArray[i]];
                        var shadowVal = Math.round(linear(c/FRAME, c, -8, 28, FRAME));
                        if (shadowVal > 0) {
                            soundItems[i].style.boxShadow = `${shadowVal}px ${shadowVal}px ${shadowVal+5}px ${topShadow},
                                    -${shadowVal}px -${shadowVal}px ${shadowVal+5}px ${bottomShadow}`;
                        } else {
                            shadowVal = Math.abs(shadowVal);
                            soundItems[i].style.boxShadow = `inset ${shadowVal}px ${shadowVal}px ${shadowVal}px ${topShadow},
                                    inset -${shadowVal}px -${shadowVal}px ${shadowVal}px ${bottomShadow}`
                        }

                        
                    }
                    rAF = requestAnimationFrame(animation);
                }
                animation();
            }
    },
    destroyed() {
        if (rAF) {
            cancelAnimationFrame(rAF);
            rAF = null;
        }
    },
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
    display: flex;
    width: 100%;
    height: 100%;
    background: #9b8e6b;
}

.wall-item {
    width: 14px;
    height: 100%;
    outline: 1px solid #605842;
    /* background: linear-gradient(to right, transparent 50%, #6b634b); */
    box-shadow: 6px 6px 10px #9d906d, -6px -6px 10px #736b51;
}
</style>


