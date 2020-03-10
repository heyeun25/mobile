<template>
  <div class="tree" ref="container">
    <canvas class="temp" ref="temp"></canvas>
    <canvas class="colorCanvas" ref="colorCanvas"></canvas>
    <canvas class="treeCanvas" ref="treeCanvas"></canvas>
    <img id="gradient" ref="gradient" src="../assets/aurora.jpg" />
    <canvas id="gradientCanvas" ref="gradientCanvas"></canvas>
  </div>
</template>
<script>
import TweenMax from "../utils/TweenMax.js";

var trash = [];
var fadeInOut;
var ctx, ctx1, ctx2;
var ctxs = [];
var totalCanvas;
var tempCanvas, tempCtx;
var colorCanvas, colorCtx;
var branches = [];
var rAF, fps = 10;

var leaf = [[0, 0], [5, -5], [10, 0], [5, 5], [0, 0]];
var ADD = 1;

// var aurora = new Image();
// aurora.src = '../assets/aurora.jpg';

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
  this.v = 0.1;
  this.endX = x - parseInt(len * Math.sin(angle * Math.PI/180));
  this.endY = y - parseInt(len * Math.cos(angle * Math.PI/180));
  this.update = function() {
      // update
      this.v += 0.1; // 
      this.px = this.x;
      this.py = this.y;
      this.x = this.originX - (this.len * this.v).toFixed(1) * Math.sin(angle * Math.PI/180);
      this.y = this.originY - (this.len * this.v).toFixed(1) * Math.cos(angle * Math.PI/180);
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
  methods: {
    restart: function() {
      console.log('restart');
      if (fadeInOut) {
        for(var i =0; i<fadeInOut.length; i++) {
          fadeInOut[i].reverse();
          console.log('reverse');
        }
      }
      
      cancelAnimationFrame(rAF);
      branches = [];
      for(var i =0; i<ctxs.length; i++) {
        ctxs[i].clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
      
      this.draw();
    },
    erase: function() {
      fadeInOut = TweenMax.staggerTo(selectReversed('.treeCanvas'), 1, {
        opacity: 0,
      }, 0.5, () => {console.log('complete')});
      console.log(fadeInOut);
    },
    draw: function() {
      console.log('draw');
      var ret = this.makeTree();
      while(ret.count < 1000) {
        ret = this.makeTree();
      }

      branches.push(ret.root);
      var that = this;
      function animate() {
        now = Date.now();
        elapsed = now - then;
        if (elapsed < fpsInterval) {
          rAF = requestAnimationFrame(animate);
          return;
        }

        if (that.playpause == true) {
          rAF = requestAnimationFrame(animate);
          return;
        }
        // draw
        if (branches.length <= 0) {
          cancelAnimationFrame(rAF);
          return;
        }

        for(var i =0; i<branches.length; i++) {
            tempCtx.beginPath();
            tempCtx.moveTo(branches[i].px, branches[i].py);
            tempCtx.lineTo(branches[i].x, branches[i].y);
            tempCtx.lineWidth = 2;
            tempCtx.stroke();
            branches[i].update();
        }

        var treeData = tempCtx.getImageData(0, 0, window.innerWidth, window.innerHeight);
        colorCtx.putImageData(treeData, 0, 0);
        colorCtx.globalCompositeOperation = 'source-in';
        // var gradientCtx = that.$refs.gradientCanvas.getContext('2d');
        var colorData = colorCtx.drawImage(that.$refs.gradientCanvas, 0, 0, window.innerWidth, window.innerHeight);
        // colorCtx.putImageData(colorData, 0, 0);

        for(var j=0; j<branches.length; j++) {
          if (branches[j].done == true) {
                var out = branches.shift();
                (out.left ? branches.push(out.left) : null);
                (out.right ?  branches.push(out.right) : null);
              }
          }
        rAF = requestAnimationFrame(animate);
      }

      // start animate first 
      var fpsInterval = 1000 / 50,
          then = Date.now(),
          now, elapsed;
      animate();
    },
    getNewItem: function(line) {

    },
    makeTree: function() {
      var trees = [];
      const startX = window.innerWidth/2,
      startY = window.innerHeight + 150,
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
  mounted: function() {
      // this.$refs.container.focus();
      totalCanvas = document.getElementsByClassName("treeCanvas");
      tempCanvas = this.$refs.temp;
      tempCtx = tempCanvas.getContext('2d');

      colorCanvas = this.$refs.colorCanvas;
      colorCtx = colorCanvas.getContext('2d');
      colorCanvas.width = window.innerWidth;
      colorCanvas.height = window.innerHeight;

      tempCanvas.width = window.innerWidth;
      tempCanvas.height = window.innerHeight;

      this.$refs.gradientCanvas.width = window.innerWidth;
      this.$refs.gradientCanvas.height = window.innerHeight;
      // console.log('mounted', totalCanvas);
      for (var i =0; i<totalCanvas.length; i++) {
        var c = totalCanvas[i].getContext("2d");
        totalCanvas[i].width = window.innerWidth;
        totalCanvas[i].height = window.innerHeight;
        c.fillStyle = "navy";
        ctxs.push(c);
      }

      var that = this;
      this.$refs.gradient.onload = () => {
        console.log('onload');
        var gradientCtx = that.$refs.gradientCanvas.getContext('2d');
        gradientCtx.drawImage(that.$refs.gradient, 0, 0, window.innerWidth, window.innerHeight);
      }

      this.draw();
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

.hello {
  position: fixed;
  width: 100%;
  height: 100%;
  /* background-color: black; */
}

.tree {
  z-index: 99999;
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
</style>
