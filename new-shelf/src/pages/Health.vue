<template>
    <div class="health">
        <div class="boardContainer">
            <transition name="slide-right">
                <div v-if="showBoard" class="board"></div>
            </transition>
        </div>
        <video ref="phoneCall"
            v-bind:class="phoneCallClass" controls
            src="../assets/video/phoneCall.mp4"></video>
        <video ref="wideCall" 
            v-bind:class="wideCallClass" controls
            src="../assets/video/phoneCall.mp4"></video>
    </div>
</template>
<script>
import "../utils/TweenMax.js";
var moveToLeft;
var makeFull;
var getMobile;
export default {
    name: 'Health',
    data() {
        return {
            showBoard: false,
            phoneCall: false,
            wide: false,
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
                    moveToLeft = TweenMax.to('.phoneCall', 1, {
                        transform: 'tranlsateX(-100%)',
                        onReverseComplete: () => {
                            this.$refs.phoneCall.currentTime = 0;
                        }
                    });
                } else {
                    moveToLeft.play();
                }
            } else {
                moveToLeft.reverse();
                this.$refs.phoneCall.pause();
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
        getMobile: function(data) {
            if (data.value == 'addBoard') {
                this.showBoard = !this.showBoard;
            } else if (data.value.phoneCall) {
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
            }
        }
    },
    mounted() {
        getMobile = this.getMobile.bind(this);
        this.$socket.on('appMsg', getMobile);
    },
    destroyed() {
        this.$socket.off('appMsg', getMobile);
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
    background-image: url('../assets/concept/Energetic-01.jpg');
    background-size: cover;
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
    width: 34%;
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
