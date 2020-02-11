<template>
  <div class="hello">
    <canvas class="treeCanvas" ref="treeCanvas">
    </canvas>
  </div>
</template>

<script>
// var canvasEl;
var ctx;
var branches = [];
var rAF;

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
  }
}

export default {
  name: 'Tree',
  props: {
    msg: String
  },
  methods: {
    draw: function(startX, startY, len, angle, branchWidth) {
      let ctx = this.$refs.treeCanvas.getContext("2d");
      branches.push(new Line(startX, startY, len, angle, branchWidth));

      function d() {
        for(var i =0; i<branches.length; i++) {
              ctx.beginPath();
              ctx.strokeStyle = "darkgreen";
              ctx.moveTo(branches[i].px, branches[i].py);
              ctx.lineTo(branches[i].x, branches[i].y);
              ctx.stroke();
              branches[i].update();
        }

        for(var j=0; j<branches.length; j++) {
          if (branches[j].done == true) {
                var out = branches.shift();
                if (out.len > 10) {
                  var p = Math.random(0.2, 0.7) + 0.2;
                  branches.push(new Line(out.endX, out.endY,
                      (out.len*p).toFixed(2), out.angle+20, out.branchWidth*0.95));
                  branches.push(new Line(out.endX, out.endY,
                      (out.len*p).toFixed(2), out.angle-20, out.branchWidth*0.95));
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
    this.draw(window.innerWidth/2, window.innerHeight, 120, 0, 5);
  }
}
</script>

<style scoped>
</style>
