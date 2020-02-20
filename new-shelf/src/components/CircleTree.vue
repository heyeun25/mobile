<template>
  <div class="hello" v-on:keydown="keyDown" tabindex="-1" ref="container">
    <!-- <img src="../assets/Beige_BG-01.png"/> -->
    <canvas class="treeCanvas" ref="treeCanvas">
    </canvas>
  </div>
</template>

<script>
import gsap from "gsap";
// var canvasEl;
var ctx;
// var points;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max, min)) + min;
}

export default {
  name: 'CircleTree',
  props: {
    msg: String
  },
  methods: {
    keyDown: function() {
        PAUSE = !PAUSE;
        console.log('pause', PAUSE);
    },
    draw: function() {
        var offset = 0.007;
        for(var i=0; i<20; i++) {
            var x = getRandomInt(0, window.innerWidth);
            var y = 0;
            var dy = 5;
            var points = [{x, y}];
            var plantHeight = getRandomInt(0, window.innerHeight);
            for(var j=0; j<plantHeight; j++) {
                points.push({
                    x: points[i - 1].x + i * offset * (getRandomInt(0, 21) - 10),
                    y: dy * i
                });
            }
        }
    }
  },
  mounted: function() {
    this.$refs.treeCanvas.width = window.innerWidth;
    this.$refs.treeCanvas.height = window.innerHeight;
    ctx = this.$refs.treeCanvas.getContext("2d");
    this.draw();
    this.$refs.container.focus();
  },
  unmounted: function() {
      cancelAnimationFrame(rAF);
  }
}
</script>

<style scoped>
img {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}
canvas {
    position: fixed;
    top: 0;
    left: 0;
}
</style>
