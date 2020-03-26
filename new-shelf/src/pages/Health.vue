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
            v-bind:widgets="widgets"></Info>
        <video ref="phoneCall"
            v-bind:class="phoneCallClass" controls loop
            src="../assets/video/TV_sero_cut.mp4"></video>
        <video ref="wideCall" 
            v-bind:class="wideCallClass" controls loop
            src="../assets/video/TV_garo.mp4"></video>
    </div>
</template>
<script>
import "../utils/TweenMax.js"
import Pleats from "../components/Pleats.vue"
import Info from "../components/Info.vue"
import * as widgetData from '../assets/healthWidgets.json'
import { clearTimeout } from 'timers';
var moveToLeft,
    makeFull,
    getMobile,
    showTimer, hideTimer;

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
            phoneCall: false,
            wide: false,
            openPleats: false,
            widgets: widgetData.widgets,
            stopWidgetVideo: false,
            pleatsItemColor: '#6b7d62',
        }
    },
    computed: {
        phoneCallClass: function() {
            return (this.wide ? 'hide ' : '') + 'phoneCall'
        },
        wideCallClass: function() {
            return (this.wide ? '' : 'hide ') + 'wideCall'
        }
    },
    watch: {
        phoneCall: function(val) {
            console.log('phoneCall= ', val);
            if (val) {
                this.$refs.phoneCall.play();
                if (!moveToLeft) {
                    var that = this;
                    moveToLeft = TweenMax.to('.phoneCall', 1, {
                        transform: 'tranlsateX(-100%)',
                        onReverseComplete: () => {
                            that.$refs.phoneCall.currentTime = 0;
                        }
                    });
                } else {
                    moveToLeft.play();
                }
                if (this.wide == false)
                    this.stopWidgetVideo = true;
            } else {
                moveToLeft.reverse();
                this.$refs.phoneCall.pause();
                if (this.wide == false) {
                    this.stopWidgetVideo = false;
                }
            }
        },
        wide: function(val) {
            if (val) { // show wide
                // make full screen
                if (!makeFull) {
                    makeFull = TweenMax.to('.wideCall', 1, {
                        left: 0,
                    });
                } else {
                    makeFull.play();
                }
                // set same currentTime width phonCall
                this.$refs.wideCall.currentTime = this.$refs.phoneCall.currentTime;
                this.$refs.wideCall.play();
            } else { // hide wide
                // init video tag
                makeFull.reverse(); 
                this.$refs.wideCall.pause();
                this.$refs.wideCall.currentTime = 0;
            }
        }
    },
    methods: {
        togglePleats: function() {
            this.openPleats = !this.openPleats;
        },
        getMobile: function(data) {
            if (data.value.phoneCall) {
                var p = data.value.phoneCall;
                if (p == 'vertical') {
                    this.phoneCall = true;
                    this.wide = false;
                } else if (p == 'horizontal') {
                    console.log('horizontal');
                    this.wide = true;
                    this.phoneCall = false;
                } else if (p == 'finish') {
                    this.phoneCall = false;
                    this.wide = false;
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

.phoneCall {
    position: absolute;
    top: 0;
    left: 67%;
    height: 100%;
    transform: translateX(100%);
}

.wideCall {
    outline: 1px solid red;
    position: absolute;
    top: 0;
    width: 100%;
    left: 67%;
    /* height: 100%; */
    /* transform: translateX(100%); */
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
