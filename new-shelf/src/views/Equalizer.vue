<template>
    <div class="container">
        <video
            ref="video"
            v-if="equalizers[eqIdx] && equalizers[eqIdx].videoSrc"
            v-bind:src="equalizers[eqIdx].videoSrc"
            v-on:click="play"
            v-bind:class="{'shown': shown}"
        ></video>
    </div>
</template>
<script>
export default {
    props: {
        eqIdx: {
            default: 0
        },
    },
    watch: {
        shown(newVal) {
            if(newVal) {
                setTimeout(this.play, 1000);
            }
            else {
                this.video.pause();
            }
        }
    },
    data() {
        return {
            equalizers: [
                {videoSrc: require('@/assets/video/visualizer_1.mp4'), loop: {start: 0}},
                {videoSrc: require('@/assets/video/visualizer_2.mp4'), loop: {start: 0}}
            ],
            shown: false
        }
    },
    mounted() {
        this.video = this.$refs.video;
        this.video.addEventListener('timeupdate', this.onTimeUpdate);
        this.video.pause();
        //setTimeout(this.play, 2000);
        this.$socket.on('appMsg', this.mobile);
    },
    beforeDestroy() {
        this.$socket.off('appMsg', this.mobile);
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
        },
        mobile: function(data) {
            console.log('mobile', data);
            var value = data.value;
            this.shown = !!value.shown;
        },
        mounted() {
            console.log('mounted');
            getMobile = this.mobile.bind(this);
            this.$socket.on('appMsg', getMobile);
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
        background-position: -269px -270px;
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
        transition: transform 500ms ease-out;
        transform: translate(99.9%, 0);
    }

    .container > video.shown {
        transform: translate(0, 0);
    }
</style>
