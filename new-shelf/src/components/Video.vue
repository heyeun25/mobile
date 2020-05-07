<template>
  <div>
    <video
      
      class="controlVideo"
      ref="controlVideo"
      v-bind:width="width"
      v-bind:height="height"
      v-bind:src="source">
    </video>
  </div>
</template>

<script>
import { setInterval, clearInterval } from 'timers';
var timer;

export default {
  name: 'Video',
  props: ['source', 'width', 'height'],
  methods: {
    play(start, end, loop) {
      var videoEl = this.$refs.controlVideo;
      videoEl.currentTime = start;
      videoEl.play();
      
      timer = setInterval(()=>{
        var c = videoEl.currentTime;
        if (c >= end){
          (loop ? videoEl.currentTime = start : videoEl.pause());
        }
        console.log(c, start, end);
      }, 100);
    },
    pause() {
      clearInterval(timer);
      this.$refs.controlVideo.pause();
    },
    stop() {
      // this.$refs.controlVideo.stop();
      clearInterval(timer);
    }
  },
  watch: {
    '$route' (to, from) {
      // 경로 변경에 반응하여...
    }
  },
  mounted: function() {
    this.$refs.controlVideo.play();
  },
  beforeDestroy() {
    if (timer) clearInterval(timer);
  },
}
</script>

<style scoped>
.controlVideo {
    position: fixed;
    left: 0;
    top: 0;
    width: 3840px;
    height: 2160px;
    /* height: 100%; */
}
</style>
