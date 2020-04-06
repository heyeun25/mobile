<template>
  <div>
    <video controls ref="myVideo"
      src="../assets/video/phoneCall.mp4"></video>
  </div>
</template>

<script>
export default {
  name: 'Video',
  props: {
    msg: String
  },
  methods: {
  },
  watch: {
    '$route' (to, from) {
      // 경로 변경에 반응하여...
    }
  },
  mounted: function() {
    this.$refs.myVideo.play();
  },
  unmounted: function() {
  }
}
</script>

<style scoped>
video {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    /* height: 100%; */
}
</style>
