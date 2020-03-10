<template>
  <div class="tree" ref="container">
    <canvas class="temp" ref="temp"></canvas>
    <canvas class="colorCanvas" ref="colorCanvas"></canvas>
    <canvas class="treeCanvas" ref="treeCanvas"></canvas>
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

function Line(x, y, len, angle, width, depth, canvasNumber) {
    this.originX = x;
    this.originY = y;
    this.px = x;
    this.py = y;
    this.v = 0.1;
    this.len = len;
    this.angle = angle;
    this.width = width;
    this.number = canvasNumber;
    this.endX = x - parseInt(len * Math.sin(angle * Math.PI/180));
    this.endY = y - parseInt(len * Math.cos(angle * Math.PI/180));
    this.branch = false;
    this.done = false;
    this.depth = depth;
    this.update = function() {
        // update
        this.v += 0.1; // 
        this.px = this.x;
        this.py = this.y;
        this.x = this.originX - (len * this.v).toFixed(1) * Math.sin(angle * Math.PI/180);
        this.y = this.originY - (len * this.v).toFixed(1) * Math.cos(angle * Math.PI/180);
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
      const startX = window.innerWidth/2,
      startY = window.innerHeight,
      len = 30,
      angle = 0,
      branchWidth = 5;

      branches.push(new Line(startX, startY, len, angle, branchWidth, 0, 0));
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
        for(var i =0; i<branches.length; i++) {
            var ctx = tempCtx;
            ctx.beginPath();
            ctx.moveTo(branches[i].px, branches[i].py);
            ctx.lineTo(branches[i].x, branches[i].y);
            ctx.lineWidth = 2;
            ctx.stroke();
            branches[i].update();
        }

        var imageData = tempCtx.getImageData(0, 0, window.innerWidth, window.innerHeight);
        colorCtx.putImageData(imageData, 0, 0);
        colorCtx.globalCompositeOperation = 'source-in';
        colorCtx.fillStyle = "green";
        colorCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        for(var j=0; j<branches.length; j++) {
          if (branches[j].done == true) {
                var out = branches.shift();
                trash.push(out);
                var num = 0;
                if (out.len > 10) {
                    var p = getRandom(out.depth)
                    branches.push(new Line(out.endX, out.endY,
                        (out.len* getRandom(out.depth)), out.angle+20, out.branchWidth*0.95, out.depth+1, 0));
                    branches.push(new Line(out.endX, out.endY,
                        (out.len* getRandom(out.depth)), out.angle-20, out.branchWidth*0.95, out.depth+1, 0));
                }
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

      function Tree(x, y, len, angle, depth, parent) {
        this.originX = x;
        this.originY = y;
        this.len = len;
        this.angle = angle;
        this.depth = depth;
        this.parent = parent;
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

      const startX = window.innerWidth/2,
      startY = window.innerHeight,
      len = 30,
      angle = 0;

      var first = new Tree(startX, startY, len, angle, 0, null);
      var count = 1;
      function createTree(item) {
        // console.log(item.len);
        if (item.len < 10) return;
        item.right = new Tree(item.endX, item.endY, item.len * getRandom(item.depth), angle+20,  item.depth+1, item);
        item.left = new Tree(item.endX, item.endY, item.len * getRandom(item.depth), angle-20, item.depth+1, item);
        count += 2;
        createTree(item.right);
        createTree(item.left);
      }

      createTree(first);
      console.log(first, count);
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
      // console.log('mounted', totalCanvas);
      for (var i =0; i<totalCanvas.length; i++) {
        var c = totalCanvas[i].getContext("2d");
        totalCanvas[i].width = window.innerWidth;
        totalCanvas[i].height = window.innerHeight;
        c.fillStyle = "navy";
        ctxs.push(c);
      }

      // this.draw();
      this.makeTree();
      // fadeInOut = TweenMax.staggerTo('.treeCanvas', 1, {
      //   opacity: 0
      // }).reverse();
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

.colorCanvas {
  /* visibility: hidden; */
}
</style>
