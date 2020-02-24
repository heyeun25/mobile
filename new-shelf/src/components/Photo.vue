<template>
  <div>
    <img ref="myImg" src="../assets/Beige_BG-01.png"/>
  </div>
</template>

<script>


export default {
  name: 'Photo',
  props: {
    msg: String
  },
  methods: {
      changeImage: function(obj) {
          console.log('changeImage', obj);
          this.$refs.myImg.src = require("../assets/" + obj.value);
      },
  },
  mounted: function() {
      this.$socket.on('appMsg', this.changeImage);
  },
  destroyed: function() {
      this.$socket.off('appMsg', this.changeImage);
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
</style>
