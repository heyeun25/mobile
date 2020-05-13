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
        this.video.pause();
        setTimeout(this.play, 2000);
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
        /* background: black; */
        /*background-image: url('../assets/fabric_navy.jpg')*/
    }
    .bg_check .container{
        background-image: url('../assets/shelf_BG_green_final.png');
        /*background-position: 269px 254px;
        background-size: 3319px 1972px;*/
        background-position: -269px -254px;
    }
    .bg_paulsmith .container {
        background-image: url('../assets/shelf_BG_paulsmith.png');
        /*background-position: 0px 0px;
        background-size: 4000px 2160px;*/
        background-position: 0px 0px;
    }
    .bg_wall .container {
        background-image: url('../assets/shelf_BG_wall.png');
        background-position: 0px 0px;
    }
    .bg_fabric .container {
        background-image: url('../assets/shelf_BG_navy.png');
        background-position: 0px 0px;
    }

    .container > video {
        width: 100%;
        height: 100%;
        object-fit: fill;
    }
</style>
