<template>
  <div class="tree" ref="container">
    <canvas class="temp" ref="temp"></canvas> <!-- draw branches !-->
    <canvas class="treeCanvas" ref="treeCanvas"></canvas>
    <img id="gradient" ref="gradient" src="../assets/greenery_BG.png" />
    <canvas id="gradientCanvas" ref="gradientCanvas"></canvas>
    <canvas id="partGradient" ref="partGradient"></canvas>
  </div>
</template>
<script>
import TweenMax from "../utils/TweenMax.js";

var trash = [];
var fadeInOut;
var tempCanvas, tempCtx;
var treeCanvas, treeCtx;
var gradientCtx;
var partCanvas, partCtx;
var branches = [];
var rAF;
var leaf = [[0, 0], [5, -5], [10, 0], [5, 5], [0, 0]];
var ADD = 1;
const IMAGE_SIZE = {w: 8680, h: 2160};
var VELOCITY = 0.1;

function Tree(x, y, len, angle, depth, parent) {
  this.x = x;
  this.y = y;
  this.originX = x;
  this.originY = y;
  this.len = len;
  this.angle = angle;
  this.depth = depth;
  this.parent = parent;
  this.done = false;
  this.right = null;
  this.left = null;
  this.v = 0;
  this.endX = x - parseInt(len * Math.sin(angle * Math.PI/180));
  this.endY = y - parseInt(len * Math.cos(angle * Math.PI/180));
  this.update = function() {
      // update
      this.v += VELOCITY;
      this.px = this.x;
      this.py = this.y;
      this.x = this.originX - (this.len * this.v) * Math.sin(angle * Math.PI/180);
      this.y = this.originY - (this.len * this.v) * Math.cos(angle * Math.PI/180);
      if (this.v > 1) this.done = true;
  }
}

function getRandom(depth) {
    // return Math.random(0.2, 0.7) + 0.2;
    var r;
    if (depth < 3)
      r = Math.random() * (1.1 - 0.4) + 0.4;
    else if (depth < 10)
      r = Math.random(0.2, 0.7) + 0.3;
    else 
      r = Math.random() * (1.0 - 0.5) + 0.5;
    return r.toFixed(1);
}

function selectReversed(query) {   
  var nodes = document.querySelectorAll(query);  
  nodes = Array.prototype.slice.call(nodes, 0);
  return nodes.reverse();
}
export default {
  name: 'Tree',
  props: {
    msg: String,
    playpause: Boolean,
  },
  watch: {
    playpause: function(val) {
      if (val == true) {
        VELOCITY = 0.05;
      } else {
        VELOCITY = 0.1;
      }
    }
  },
  methods: {
    restart: function() {
      console.log('restart');
      if (fadeInOut) {
        for(var i =0; i<fadeInOut.length; i++) {
          fadeInOut[i].reverse();
          console.log('reverse');
        }
      }
      this.init();
      this.draw();
    },
    init: function() {
      branches = [];
      tempCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      treeCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      cancelAnimationFrame(rAF);
    },
    erase: function() {
      // fadeInOut = TweenMax.staggerTo(selectReversed('.treeCanvas'), 1, {
      //   opacity: 0,
      // }, 0.5, () => {console.log('complete')});
      // console.log(fadeInOut);
    },
    draw: function() {
      console.log('draw');
      var ret = this.makeTree();
      while(ret.count < 100000) {
        ret = this.makeTree();
      }

      branches.push(ret.root);
      var that = this;
      // start animate first 
      var fpsInterval = 10,
          then = Date.now(),
          now, elapsed;

      var gradientStartPoint = 0;
      var gradientOffset = 1;

      function animate() {
        now = Date.now();
        elapsed = now - then;
        if (elapsed < fpsInterval) {
          rAF = requestAnimationFrame(animate);
          return;
        }
        then = now;

        for(var i =0; i<branches.length; i++) {
            tempCtx.beginPath();
            tempCtx.moveTo(branches[i].px, branches[i].py);
            tempCtx.lineTo(branches[i].x, branches[i].y);
            tempCtx.lineWidth = 1;
            tempCtx.strokeStyle = 'white';
            tempCtx.stroke();
            branches[i].update();
        }

        var treeData = tempCtx.getImageData(0, 0, window.innerWidth, window.innerHeight);
        treeCtx.putImageData(treeData, 0, 0);
        treeCtx.globalCompositeOperation = 'source-in';
        // ready canvas 
        if (gradientOffset > 0) {
          gradientStartPoint += 50;
          if (gradientStartPoint + window.innerWidth >= IMAGE_SIZE.w)
            gradientOffset = -1;
        } else {
          gradientStartPoint -= 50;
          if (gradientStartPoint <= 0) gradientOffset = 1;
        }
        var imgData = gradientCtx.getImageData(gradientStartPoint, 0, window.innerWidth, window.innerHeight)
        partCtx.putImageData(imgData, 0, 0);
        var colorData = treeCtx.drawImage(that.$refs.partGradient, 0, 0,
            window.innerWidth, window.innerHeight);

        for(var j=0; j<branches.length; j++) {
          if (branches[j].done == true) {
                var out = branches.shift();
                (out.left ? branches.push(out.left) : null);
                (out.right ?  branches.push(out.right) : null);
              }
          }
        rAF = requestAnimationFrame(animate);
      }
      animate();
    },
    getNewItem: function(line) {

    },
    makeTree: function() {
      var trees = [];
      const startX = window.innerWidth/2,
      startY = window.innerHeight + 130,
      len = 120,
      angle = 0;

      var first = new Tree(startX, startY, len, angle, 0, null);
      var count = 1;
      function createTree(item) {
        // console.log(item.len);
        if (item.len < 10) return;
        item.right = new Tree(item.endX, item.endY, item.len * getRandom(item.depth), item.angle+20,  item.depth+1, item);
        item.left = new Tree(item.endX, item.endY, item.len * getRandom(item.depth), item.angle-20, item.depth+1, item);
        count += 2;
        createTree(item.right);
        createTree(item.left);
      }
      createTree(first);
      console.log(first, count);
      return {root: first, count};
    }
  },
  mounted() {
      // this.$refs.container.focus();
      console.log('tree mounted');
      tempCanvas = this.$refs.temp;
      tempCtx = tempCanvas.getContext('2d');
      tempCanvas.width = window.innerWidth;
      tempCanvas.height = window.innerHeight;

      treeCanvas = this.$refs.treeCanvas;
      treeCtx = treeCanvas.getContext('2d');
      treeCanvas.width = window.innerWidth;
      treeCanvas.height = window.innerHeight;

      partCanvas = this.$refs.partGradient;
      partCtx = partCanvas.getContext('2d');
      partCanvas.width = window.innerWidth;
      partCanvas.height = window.innerHeight;
      
      gradientCtx = this.$refs.gradientCanvas.getContext('2d');

      this.$refs.gradientCanvas.width = IMAGE_SIZE.w;
      this.$refs.gradientCanvas.height = IMAGE_SIZE.h;

      var that = this;
      this.$refs.gradient.onload = () => {
        console.log('onload');
        gradientCtx.drawImage(that.$refs.gradient, 0, 0);
        var part = gradientCtx.getImageData(0, 0, window.innerWidth, window.innerHeight);
        partCtx.putImageData(part, 0, 0);
      }
      this.draw();
  },
  destroyed() {
      console.log('tree destroy');
      this.init();
  }
}
</script>

<style scoped>
img {
    position: fixed;
    left: 0;
    top: 0;
}
canvas {
    position: fixed;
    top: 0;
    left: 0;
}

.hello {
  position: fixed;
  width: 100%;
  height: 100%;
  /* background-color: black; */
}

.tree {
  /* background-color: black; */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.temp {
  visibility: hidden;
}

#gradientCanvas {
  visibility: hidden;
}

#gradientImage {
  visibility: hidden;
}

#gradient {
  visibility: hidden;
}

#partGradient {
  visibility: hidden;
}
</style>
