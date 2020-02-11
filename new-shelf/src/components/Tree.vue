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
  // console.log('end', this.endX, this.endY, 'start', this.x, this.y);
  this.done = false;
  this.update = function() {
    // update
    this.v += 0.1;
    this.px = this.x;
    this.py = this.y;
    this.x = this.originX - len * this.v.toFixed(1) * Math.sin(angle * Math.PI/180);
    this.y = this.originY - len * this.v.toFixed(1) * Math.cos(angle * Math.PI/180);
    if (this.v > 1) this.done = true;
    // console.log(this.x, this.y);
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
      // ctx.beginPath();
      // ctx.save();

      // var rotateX = len * Math.sin(angle * Math.PI/180);
      // var rotateY = len * Math.cos(angle * Math.PI/180);
      // branches.push({start: {x: startX, y: startY},
      //                end: {x: startX - rotateX, y: startY - rotateY},
      //                width: branchWidth});

      branches.push(new Line(startX, startY, len, angle, branchWidth));

      function d() {
        // var check = false;
        for(var i =0; i<branches.length; i++) {
              ctx.beginPath();
              ctx.strokeStyle = "darkgreen";
              ctx.moveTo(branches[i].px, branches[i].py);
              ctx.lineTo(branches[i].x, branches[i].y);
              ctx.stroke();
              branches[i].update();
              if (branches[i].done == true) {
                var out = branches.shift();
                if (out.len > 10) {
                  var p = Math.random(0.2, 0.7) + 0.2;
                  p = 0.5;
                  branches.push(new Line(out.endX, out.endY,
                      (out.len*p).toFixed(5), out.angle+15, out.branchWidth*0.95));
                  branches.push(new Line(out.endX, out.endY,
                      (out.len*p).toFixed(5), out.angle-15, out.branchWidth*0.95));
                }
              }
        }

        // if (check == false) {
        //     var keep = false;
        //     for(var i =0; i<branches.length; i++) {
        //       var target = branches[i];
        //       if (target.branch == false && target.len > 10) {
        //           keep = true;
        //           var p = Math.random(0.2, 0.7) + 0.2;
        //           // p = 0.8
        //           branches.push(new Line(target.endX, target.endY,
        //               (target.len*p).toFixed(2), target.angle+15, target.branchWidth*0.95));
        //           branches.push(new Line(target.endX, target.endY,
        //               (target.len*p).toFixed(2), target.angle-15, target.branchWidth*0.95));
        //           // requestAnimationFrame(d);
        //           target.branch = true;
        //       }
        //     }
        //     if (keep == false && i == branches.length) {
        //       cancelAnimationFrame(rAF);
        //     }
        // }
        rAF = requestAnimationFrame(d);
      }




      rAF = requestAnimationFrame(d);
      // ctx.moveTo(startX, startY);
      // ctx.lineTo(startX - rotateX, startY - rotateY);
      // ctx.strokeStyle = "darkgreen";
      // ctx.fillStyle = "green";
      // ctx.lineWidth = branchWidth;
      // ctx.stroke();

      if (len < 10) {
        // ctx.beginPath();
        // var m = angle;
        // ctx.arc(startX - rotateX, startY - rotateY-4, 5, -(90-m)*Math.PI/180, (90+m)*Math.PI/180);
        // if (Math.random() > 0.8)
        // ctx.fillStyle = "#" + Math.round(Math.random() * 0xffffff).toString(16);
        // ctx.fill();
        // ctx.restore();
        console.log(branches)
        return;
      }
      var p = Math.random(0.2, 0.7) + 0.2;
      p = 0.5;
      // this.draw(startX - rotateX, startY - rotateY, len*p.toFixed(2), angle+15, branchWidth*0.95);
      // this.draw(startX - rotateX, startY - rotateY, len*p.toFixed(2), angle-15, branchWidth*0.95);
      // ctx.restore();
    }
  },
  mounted: function() {
    this.$refs.treeCanvas.width = window.innerWidth;
    this.$refs.treeCanvas.height = window.innerHeight;
    
    this.draw(window.innerWidth/2, window.innerHeight, 120, 0, 5);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
