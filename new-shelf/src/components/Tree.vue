<template>
  <div class="hello" ref="container">
    <!-- <img src="../assets/navy_BG-01.jpg"/> -->
    <!-- <img src="../assets/Beige_BG-01.png"/> -->
    <canvas class="treeCanvas" ref="treeCanvas"></canvas>
    <canvas class="treeCanvas" ref="treeCanvas1"></canvas>
    <canvas class="treeCanvas" ref="treeCanvas2"></canvas>
  </div>
</template>

<script>
// import TweenMax from "gsap";
// import TimelineMax from "gsap";
import TweenMax from "../utils/TweenMax.js";


var fadeInOut;

var ctx, ctx1, ctx2;
var ctxs = [];
var totalCanvas;

var branches = [];
var rAF, fps = 10;

var leaf = [[0, 0], [5, -5], [10, 0], [5, 5], [0, 0]];
var ADD = 1;

function Line(x, y, len, angle, width, depth, canvasNumber) {
    this.originX = x;
    this.originY = y;
    this.px = x;
    this.py = y;
    this.x = x;
    this.y = y;
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
        // if (Math.random() > 0.99) {
        //     this.makeLeaf(this.x, this.y, this.angle);
        // }
    }
    // this.makeLeaf = function() {
    //     ctx.beginPath();
    //     ctx.moveTo(this.x, this.y);
    //     var d = 1;
    //     if (Math.random() > 0.5) d = -1;
    //     ctx.quadraticCurveTo(
    //             x - d*(10 * Math.cos((45 + this.angle) * Math.PI/180)),
    //             y + d*(10 * Math.sin((45 + this.angle) * Math.PI/180)),
    //             x - d*(20 * Math.cos((this.angle) * Math.PI/180)),
    //             y + d*(20 * Math.sin((this.angle) * Math.PI/180)));
    //     ctx.fillStyle="darkgreen";
    //     ctx.fill();
    // }
}

function getRandom(min, max) {
  return Math.random() * (max-min) + min;
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
      // fadeInOut.reverse();
        // fadeInOut.staggerTo('.treeCanvas')
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
      const startX = window.innerWidth/2,
      startY = window.innerHeight + 150,
      len = 120,
      angle = 0,
      branchWidth = 5;

      branches.push(new Line(startX, startY, len, angle, branchWidth, 0, 0));
      var that = this;
      function d() {
        if (that.playpause == false) {
            for(var i =0; i<branches.length; i++) {
                // console.log(branches[i].number);
                var ctx = ctxs[branches[i].number];
                ctx.beginPath();
                ctx.strokeStyle = "rgba(15, 180, 10)";
                ctx.moveTo(branches[i].px, branches[i].py);
                ctx.lineTo(branches[i].x, branches[i].y);
                ctx.lineWidth = 2;
                ctx.stroke();
                branches[i].update();
              }

            for(var j=0; j<branches.length; j++) {
              if (branches[j].done == true) {
                    var out = branches.shift();
                    var num = 0;
                    if (out.len > 10) {
                        if (out.depth > 10) num = 1;
                        if (out.depth > 30) num = 2;
                        // console.log(out.depth);
                        var p = Math.random() + 0.2;
                        p = p.toFixed(1);
                        branches.push(new Line(out.endX, out.endY,
                            (out.len*p), out.angle+20, out.branchWidth*0.95, out.depth+1, num));
                        branches.push(new Line(out.endX, out.endY,
                            (out.len*p), out.angle-20, out.branchWidth*0.95, out.depth+1, num));
                    }
                }
          }
        }
        rAF = requestAnimationFrame(d);
      }
      rAF = requestAnimationFrame(d);
    }
  },
  mounted: function() {
      // this.$refs.container.focus();
      totalCanvas = document.getElementsByClassName("treeCanvas");
      // console.log('mounted', totalCanvas);
      for (var i =0; i<totalCanvas.length; i++) {
        var c = totalCanvas[i].getContext("2d");
        totalCanvas[i].width = window.innerWidth;
        totalCanvas[i].height = window.innerHeight;
        ctxs.push(c);
      }

      this.draw();
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
</style>
