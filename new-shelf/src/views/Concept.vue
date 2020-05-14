<template>
    <div class="concept">
        <video ref="conceptVideo"
               src='@/assets/video/Shelf_Concept_0514.mp4'></video>
        <img v-bind:class='wallClass' src='@/assets/shelf_BG_wall.png'/>
    </div>
</template>
<script>
var getMobile = "";
export default {
    data() {
        return {
            wallClass: ''
        }
    }, 
    methods: {
        mobile(data) {
            var value = data.value;
            if (value.showConcept == true) {
                this.wallClass = 'slide-right';
            } else if (value.playVideo == true) {
                this.$refs.conceptVideo.play();
            } else if (value.showConcept == false) {
                this.$refs.conceptVideo.pause();
                this.wallClass = 'slide-left';
            }
        }
    },
    mounted() {
        getMobile = this.mobile.bind(this);
        this.$socket.on('appMsg', getMobile);
    },
    beforeDestroy() {
        this.$socket.off('appMsg', getMobile);
    },
}
</script>
<style>
.concept > video {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}
.concept > img{
    position: absolute;
    left: 0;
    top: 0;
}

.slide-left {
    animation: 1s to-left forwards;
}

.slide-right {
    animation: 1s to-right forwards;
}

@keyframes to-left {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
}

@keyframes to-right {
    from { transform: translateX(0); }
    to { transform: translateX(100%); }
}

</style>
