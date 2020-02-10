<template>
  <div class="hello">
    <canvas class="treeCanvas" ref="treeCanvas">
    </canvas>
  </div>
</template>

<script>

// var canvasEl;
// var ctx;

export default {
  name: 'Tree',
  props: {
    msg: String
  },
  methods: {
    draw: function(startX, startY, len, angle, branchWidth) {
      let ctx = this.$refs.treeCanvas.getContext("2d");
      ctx.beginPath();
      ctx.save();
      
      // ctx.translate(startX, startY);
      // ctx.rotate(angle * Math.PI/180);

      var rotateX = len * Math.sin(angle * Math.PI/180);
      var rotateY = len * Math.cos(angle * Math.PI/180);
      // console.log(rotateX, rotateY);

      ctx.moveTo(startX, startY);
      // if(angle > 0) {
      //     ctx.bezierCurveTo(10, -len/2, 10, -len/2, 0, -len);
      // } else {
      //     ctx.bezierCurveTo(-10, -len/2, -10, -len/2, 0, -len);
      // }
      ctx.lineTo(startX - rotateX, startY - rotateY);
      ctx.strokeStyle = "darkgreen";
      ctx.fillStyle = "green";
      ctx.lineWidth = branchWidth;
      // ctx.shadowBlur = 15;
      // ctx.shadowColor = "rgba(0,0,0,0.8)";
      ctx.stroke();

      if (len < 10) {
        ctx.beginPath();
        ctx.arc(0, -len, 10, 0, Math.PI/2);
        if (Math.random() > 0.8)
          ctx.fillStyle = "#" + Math.round(Math.random() * 0xffffff).toString(16);
        ctx.fill();
        ctx.restore();
        return;
      }
      var p = Math.random(0.2, 0.7) + 0.2;

      this.draw(startX - rotateX, startY - rotateY, len*p.toFixed(2), angle+15, branchWidth*0.95);
      this.draw(startX - rotateX, startY - rotateY, len*p.toFixed(2), angle-15, branchWidth*0.95);
      // this.draw(0, -len, len*p.toFixed(2), angle-15, branchWidth*0.95);

      ctx.restore();
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
