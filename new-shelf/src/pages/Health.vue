<template>
    <div class="health" v-on:click="togglePleats">
        <Pleats ref="pleats"
            dir="health"
            v-bind:stayPleats="true"
            v-bind:show="openPleats"
            v-bind:pleatsItemColor="pleatsItemColor"
            v-bind:color="bgColor"></Pleats>
        <Info ref="info"
            dir="health"
            v-bind:show="openPleats"
            v-bind:stopWidgetVideo="stopWidgetVideo"
            videoStartTime="31.8"
            v-bind:widgets="widgets"></Info>
        <video ref="horizontalVideo"
            v-bind:class="hotizontalVideoClass"
            controls loop
            src="../assets/video/TV_garo.mp4"></video>
        <video ref="verticalVideo2"
            v-bind:class="verticalVideo2Class" controls loop
            src="../assets/video/TV_sero_02.mp4"></video>
        <video ref="verticalVideo"
            v-bind:class="verticalVideoClass" controls loop
            src="../assets/video/TV_sero.mp4"></video>
    </div>
</template>
<script>
// import "../utils/TweenMax.js"
import Pleats from "../components/Pleats.vue"
import Info from "../components/Info.vue"
import * as widgetData from '../assets/healthWidgets.json'
import { clearTimeout } from 'timers';
var moveToLeft,
    makeFull,
    getMobile,
    showTimer, hideTimer;
const VIDEO_STATUS = {
    NONE : 0,
    VERTICAL : 1,
    VERTICAL2 : 2,
    HORIZONTAL : 3,
};

export default {
    name: 'Health',
    components: {
        Pleats,
        Info
    },
    props: {
        bgColor: {
            type: String,
            default: "#101012"
        }
    },
    data() {
        return {
            // wide: false,
            videoStatus : VIDEO_STATUS.NONE,
            openPleats: false,
            widgets: widgetData.widgets,
            stopWidgetVideo: false,
            pleatsItemColor: '#6b7d62',
            hotizontalVideoClass: 'hide horizontalVideo',
            verticalVideoClass: 'hide verticalVideo',
            verticalVideo2Class: 'hide verticalVideo2'
        }
    },
    watch: {
        videoStatus: function(val) {
            switch(val) {
                case VIDEO_STATUS.NONE:
                this.verticalVideo2Class = 'hide verticalVideo2';
                this.hotizontalVideoClass = "horizontalVideo hotizontalHide";
                this.stopWidgetVideo = false;
                this.$refs.horizontalVideo.pause();
                break;
                case VIDEO_STATUS.VERTICAL:
                this.verticalVideoClass = 'verticalVideo verticalShow';
                this.stopWidgetVideo = true;
                this.$refs.verticalVideo.currentTime = 0;
                this.$refs.verticalVideo.play();
                break;
                case VIDEO_STATUS.VERTICAL2:
                this.verticalVideoClass = 'hide verticalVideo';
                this.verticalVideo2Class = 'verticalVideo2';
                this.hotizontalVideoClass = 'horizontalVideo horizontalShow';
                this.$refs.verticalVideo.pause();
                this.$refs.verticalVideo2.currentTime = 0;
                this.$refs.verticalVideo2.play();
                break;
                case VIDEO_STATUS.HORIZONTAL:
                this.verticalVideo2Class = 'hide verticalVideo2';
                this.hotizontalVideoClass = "horizontalVideo hotizontalFullScreen";
                this.$refs.verticalVideo2.pause();
                this.$refs.horizontalVideo.play();
                // this.$refs.horizontalVideo.currentTime = this.$refs.verticalVideo.currentTime;
                break;
                default:
                break;
            }
        }


        // verticalVideo: function(val) {
        //     console.log('verticalVideo= ', val);
        //     // if (val) {
        //     //     this.$refs.verticalVideo.play();
        //     //     if (!moveToLeft) {
        //     //         var that = this;
        //     //         moveToLeft = TweenMax.to('.verticalVideo', 1, {
        //     //             transform: 'tranlsateX(-100%)',
        //     //             onComplete: function() {
        //     //                 that.hotizontalVideoClass = "horizontalVideo wideShow";
        //     //             },
        //     //             onReverseComplete: () => {
        //     //                 that.$refs.verticalVideo.currentTime = 0;
        //     //             }
        //     //         });
        //     //     } else {
        //     //         moveToLeft.play();
        //     //     }
        //     //     if (this.wide == false)
        //     //         this.stopWidgetVideo = true;
        //     // } else {
        //     //     moveToLeft.reverse();
        //     //     this.$refs.verticalVideo.pause();
        //     //     if (this.wide == false) {
        //     //         this.stopWidgetVideo = false;
        //     //     }
        //     // }
        // },
        // wide: function(val) {
        //     if (val) { // show wide
        //         // make full screen
        //         // set same currentTime width phonCall
        //         this.hotizontalVideoClass = "horizontalVideo hotizontalFullScreen"
        //         this.$refs.horizontalVideo.currentTime = this.$refs.verticalVideo.currentTime;
        //         this.$refs.horizontalVideo.play();
        //     } else { // hide wide
        //         // init video tag
        //         this.hotizontalVideoClass = "horizontalVideo wideHide"
        //         this.$refs.horizontalVideo.pause();
        //         this.$refs.horizontalVideo.currentTime = 0;
        //     }
        // }
    },
    methods: {
        togglePleats: function() {
            this.openPleats = !this.openPleats;
        },
        getMobile: function(data) {
            console.log('getMobile', data);
            if (data.value.phoneCall) {
                var p = data.value.phoneCall;
                if (p == 'vertical') {
                    this.videoStatus = VIDEO_STATUS.VERTICAL;
                } else if (p == 'second') {
                    this.videoStatus = VIDEO_STATUS.VERTICAL2;
                } else if (p == 'horizontal') {
                    this.videoStatus = VIDEO_STATUS.HORIZONTAL;
                } else if (p == 'stop') {
                    this.videoStatus = VIDEO_STATUS.NONE;
                }
            } else if (data.value == 'account') {
                var myRouter = this.$router;
                hideTimer = setTimeout(() => {
                    myRouter.push({name: 'account',
                    params: {id : 1, bgColor: this.color}});
                }, 500);
            } else if (data.value.color) {
                this.pleatsItemColor = data.value.color;
                console.log('pleatsItemColor ', this.pleatsItemColor);
            } 
        }
    },
    mounted() {
        getMobile = this.getMobile.bind(this);
        this.$socket.on('appMsg', getMobile);
        var that = this;
        showTimer = setTimeout(() => {
            that.togglePleats();
        }, 500);
    },
    destroyed() {
        this.$socket.off('appMsg', getMobile);
        // clearTimeout(hideTimer);
        // clearTimeout(showTimer);
    },
}
</script>
<style>
.health {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.boardContainer {
    position: relative;
    top: 0;
    left: 45%;
    width: 20%;
    height: 100%;
    overflow: hidden;
    /* background-color: navy; */
}

.board {
    position: absolute;
    top: 10%;
    left: 0;
    width: 300px;
    height: 500px;
    background-color: aqua;
    /* transform: translateX(-100%); */
}

.verticalVideo {
    position: absolute;
    right: 0;
    height: 100%;
    transform: translateX(100%);
}

.verticalVideo2 {
    position: absolute;
    right: 0;
    height: 100%;
}

.horizontalVideo {
    outline: 1px solid red;
    position: absolute;
    top: 0;
    width: 100%;
    left: 100%;
}

.horizontalShow {
    left: 68%;
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

@keyframes toLeft {
    from {
        left: 67%;
    }
    to {
        left: 0;
    }
}

@keyframes toRight {
    from {
        left: 0;
    }
    to {
        left: 100%;
    }
}

@keyframes toVLeft {
    from {
        transform: translateX(100%);
    }
    to {
        transform: translateX(0);
    }
}

@keyframes toVRight {
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(100%);
    }
}

.hide {
    visibility: hidden;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 1s;
}
.slide-right-enter,
.slide-right-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateX(-100%)
}
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 1s;
}
.slide-left-enter,
.slide-left-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateX(100%)
}

</style>
