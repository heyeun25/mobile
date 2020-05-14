<template>
    <div class="displayShelf">
        <Video
            ref="shelfUI"
            v-bind:source="require('@/assets/video/Shelf_UI_2-0_final.mp4')">
        </Video>
        <video ref="horizontalVideo"
            v-bind:class="horizontalVideoClass"
            loop mute
            src="../assets/video/TV_garo.mp4"></video>
        <video ref="verticalVideo2"
            v-bind:class="verticalVideo2Class"
            loop
            muted
            src="../assets/video/TV_sero_02.mp4"></video>
        <video ref="verticalVideo"
            v-bind:class="verticalVideoClass"
            loop
            muted
            src="../assets/video/TV_sero.mp4"></video>
    </div>
</template>
<script>
import Video from '@/components/Video.vue'
var getMobile;
const VIDEO_STATUS = {
    NONE : 0,
    VERTICAL : 1,
    VERTICAL2 : 2,
    HORIZONTAL : 3,
};

export default {
    name: 'displayShelf',
    components: {
        Video,
    },
    data() {
        return {
            videoStatus : VIDEO_STATUS.NONE,
            horizontalVideoClass: 'hotizontalHide horizontalVideo',
            verticalVideoClass: 'hide verticalVideo',
            verticalVideo2Class: 'hide verticalVideo2'
        }
    },
    watch: {
        videoStatus: function(val) {
            console.log('val=', val);
            switch(val) {
                case VIDEO_STATUS.NONE:
                    this.verticalVideoClass = 'hide verticalVideo';
                    this.verticalVideo2Class = 'hide verticalVideo2';
                    this.horizontalVideoClass = "horizontalVideo hotizontalHide";
                    this.stopWidgetVideo = false;
                    this.$refs.verticalVideo.currentTime = 0;
                    this.$refs.verticalVideo.pause();
                    this.$refs.verticalVideo2.currentTime = 0;
                    this.$refs.verticalVideo2.pause();
                    this.$refs.horizontalVideo.currentTime = 0;
                    this.$refs.horizontalVideo.pause();
                break;
                case VIDEO_STATUS.VERTICAL:
                    this.verticalVideoClass = 'verticalVideo verticalShow';
                    this.verticalVideo2Class = 'hide verticalVideo2';
                    this.horizontalVideoClass = "horizontalVideo hotizontalHide";
                    this.stopWidgetVideo = true;
                    this.$refs.verticalVideo.currentTime = 0;
                    this.$refs.verticalVideo.play();
                    this.$refs.verticalVideo2.currentTime = 0;
                    this.$refs.verticalVideo2.pause();
                    this.$refs.horizontalVideo.currentTime = 0;
                    this.$refs.horizontalVideo.pause();
                break;
                case VIDEO_STATUS.VERTICAL2:
                    this.verticalVideoClass = 'hide verticalVideo';
                    this.verticalVideo2Class = 'verticalVideo2';
                    this.horizontalVideoClass = 'horizontalVideo hotizontalHide';
                    this.$refs.verticalVideo.currentTime = 0;
                    this.$refs.verticalVideo.pause();
                    this.$refs.verticalVideo2.currentTime = 0;
                    this.$refs.verticalVideo2.play();
                    this.$refs.horizontalVideo.currentTime = 0;
                    this.$refs.horizontalVideo.pause();
                break;
                case VIDEO_STATUS.HORIZONTAL:
                    this.verticalVideoClass = 'hide verticalVideo';
                    this.verticalVideo2Class = 'hide verticalVideo2';
                    this.horizontalVideoClass = "horizontalVideo hotizontalFullScreen";

                    this.$refs.verticalVideo.currentTime = 0;
                    this.$refs.verticalVideo.pause();
                    this.$refs.verticalVideo2.currentTime = 0;
                    this.$refs.verticalVideo2.pause();
                    this.$refs.horizontalVideo.currentTime = 0;
                    this.$refs.horizontalVideo.play();
                // this.$refs.horizontalVideo.currentTime = this.$refs.verticalVideo.currentTime;
                break;
                default:
                break;
            }
        }
    },
    methods: {
        
        mobile: function(data) {
            console.log('mobile', data);
            var value = data.value;
            if (value.start) {
                this.$refs.shelfUI.stop();
                this.$refs.shelfUI.play(value.start, value.end);
            } else if (value.pause) {
                this.$refs.shelfUI.pause();
            }
            if (value.video) {
                var p = value.video;
                if (p == 'vertical') {
                    this.videoStatus = VIDEO_STATUS.VERTICAL;
                } else if (p == 'second') {
                    this.videoStatus = VIDEO_STATUS.VERTICAL2;
                } else if (p == 'horizontal') {
                    this.videoStatus = VIDEO_STATUS.HORIZONTAL;
                } else if (p == 'stop') {
                    this.videoStatus = VIDEO_STATUS.NONE;
                }
            }
            else {
                this.videoStatus = VIDEO_STATUS.NONE;
            }
        }
    },
    mounted() {
        console.log('mounted');
        getMobile = this.mobile.bind(this);
        this.$socket.on('appMsg', getMobile);
    },
    beforeDestroy() {
        this.$socket.off('appMsg', getMobile);
    },
}
</script>
<style>
    .displayShelf {
        width: 100%;
        height: 100%;
    }
.verticalVideo {
    position: absolute;
    right: 0px;
    height: 101%;
    transform: translateX(100%);
}

.verticalVideo2 {
    position: absolute;
    right: 0px;
    height: 101%;
}

.horizontalVideo {
    /* outline: 1px solid red; */
    position: absolute;
    top: 0;
    width: 100%;
    left: 100%;
    height: 101%;
    object-fit: fill;
}

.horizontalShow {
    left: 69%;
}

.hotizontalFullScreen {
    animation: 1s toLeft forwards;
}

.hotizontalHide {
    animation: 1s toRight forwards;
}

.verticalShow {
    animation: 1s toVLeft forwards;
}

.verticalHide {
    animation: 1s toVRight forwards;
}

.hide {
    visibility: hidden;
}

@keyframes toLeft {
    from { left: 67%; }
    to { left: 0; }
}

@keyframes toRight {
    from { left: 0; }
    to { left: 100%; }
}

@keyframes toVLeft {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
}

@keyframes toVRight {
    from { transform: translateX(0); }
    to { transform: translateX(100%); }
}

</style>
