<template>
  <div class="hello">
    <!-- <img src="../assets/navy_BG-01.jpg"/> -->
    <!-- <img src="../assets/Beige_BG-01.png"/> -->
    <canvas class="treeCanvas" ref="treeCanvas">
    </canvas>
  </div>
</template>

<script>
var ctx;
var branches = [];
var rAF;

var leaf = [[0, 0], [5, -5], [10, 0], [5, 5], [0, 0]];
var ADD = 1;

var depth = 0;

function Line(x, y, len, angle, width) {
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
    this.endX = x - parseInt(len * Math.sin(angle * Math.PI/180));
    this.endY = y - parseInt(len * Math.cos(angle * Math.PI/180));
    this.branch = false;
    this.done = false;
    this.update = function() {
        // update
        this.v += 0.1;
        this.px = this.x;
        this.py = this.y;
        this.x = this.originX - len * this.v.toFixed(1) * Math.sin(angle * Math.PI/180);
        this.y = this.originY - len * this.v.toFixed(1) * Math.cos(angle * Math.PI/180);
        if (this.v > 1) this.done = true;
        if (Math.random() > 0.99) {
            // this.makeLeaf(this.x, this.y, this.angle);
        }
    }
    this.makeLeaf = function(x, y, angle) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(
                x - (20 * Math.cos((45 + angle) * Math.PI/180)),
                y + (20 * Math.sin((45 + angle) * Math.PI/180)),
                x - (40 * Math.cos((angle) * Math.PI/180)),
                y + (40 * Math.sin((angle) * Math.PI/180)));
        ctx.fillStyle="darkgreen";
        ctx.fill();
    }
}

export default {
  name: 'Tree',
  props: {
    msg: String
  },
  methods: {
    draw: function(startX, startY, len, angle, branchWidth) {
      branches.push(new Line(startX, startY, len, angle, branchWidth));

      function d() {
        for(var i =0; i<branches.length; i++) {
              ctx.beginPath();
              // ctx.strokeStyle = "darkgreen";
              ctx.strokeStyle = "rgba(15, 36, 10)";

              ctx.moveTo(branches[i].px, branches[i].py);
              ctx.lineTo(branches[i].x, branches[i].y);
              ctx.lineWidth = 1;
              ctx.stroke();
              branches[i].update();
        }

        for(var j=0; j<branches.length; j++) {
          if (branches[j].done == true) {
                var out = branches.shift();
                if (out.len > 10) {
                    depth++;
                    var p = Math.random(0.2, 0.7) + 0.2;
                    branches.push(new Line(out.endX, out.endY,
                        (out.len*p), out.angle+20, out.branchWidth*0.95));
                    branches.push(new Line(out.endX, out.endY,
                        (out.len*p), out.angle-20, out.branchWidth*0.95));
                } else {
                }
              }
        }
        rAF = requestAnimationFrame(d);
      }
      rAF = requestAnimationFrame(d);
    }
  },
  mounted: function() {
    this.$refs.treeCanvas.width = window.innerWidth;
    this.$refs.treeCanvas.height = window.innerHeight;
    ctx = this.$refs.treeCanvas.getContext("2d");
    this.draw(window.innerWidth/2, window.innerHeight + 150, 120, 0, 5);
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
