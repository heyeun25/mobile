<template>
    <div class="container">
        <video
            ref="video"
            v-if="equalizers[eqIdx] && equalizers[eqIdx].videoSrc"
            v-bind:src="equalizers[eqIdx].videoSrc"
            v-on:click="play"
            autoplay

        ></video>
    </div>
</template>
<script>
export default {
    props: {
        eqIdx: {
            default: 0
        }
    },
    data() {
        return {
            equalizers: [
                {videoSrc: require('@/assets/video/visualizer_1.mp4'), loop: {start: 0}},
                {videoSrc: require('@/assets/video/visualizer_2.mp4'), loop: {start: 0}}
            ]
        }
    },
    mounted() {
        this.video = this.$refs.video;
        this.video.addEventListener('timeupdate', this.onTimeUpdate);
        this.play();
    },
    methods: {
        play() {
            this.video.play();
        },
        onTimeUpdate() {
            if(this.equalizers[this.eqIdx] && this.equalizers[this.eqIdx].loop) {
                var endTime = this.equalizers[this.eqIdx].loop.end || this.video.duration;
                if(this.video.currentTime >= endTime) {
                    var startTime = this.equalizers[this.eqIdx].loop.start || 0;
                    console.log('LOOP: ' + startTime);
                    this.video.currentTime = startTime;
                    this.play();
                }
            }
        }
    }
}
</script>
<style>
    .container {
        position: absolute;
        width: 100%;
        height: 100%;
        background: black;
    }
    .container > video {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
</style>
