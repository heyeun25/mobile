<template>
    <div class="pleatsContainer" ref="pleatsContainer" v-bind:style="containerStyle">
        <div v-bind:class="'pleats ' + (stayPleats ? 'stayPleats' : '')" ref="pleats"
                v-bind:key="'p' + index"
                v-for="(item, index) in pleatsCnt"
                v-bind:id="'p' + index"
                v-bind:style="{
                    backgroundColor: color, 
                    width: pleatsWidth}">
        </div>
        <div v-if="blackBoard" 
            v-bind:class="'blackBoard '+(showBlackBoard ? 'blackBoardIn' : 'blackBoardOut')"
            ref="blackBoard"></div>
    </div>
</template>
<script>
import {setTimeout} from 'timers'

const PLEATS_WIDTH = 40;
const WIDGET_WIDTH = 300;
const SHIRINK = 0.95;
var PLEATS_CNT = 140;

var pleatsAni;
var widgetAni = [];
export default {
    name: 'Pleats',
    props: {
        stayPleats: Boolean,
        show: Boolean,
        color: String,
        widgets: {
            type: Array,
            default: () => [],
        },
        dir: String,
        blackBoard: {
            type: Boolean,
            default: false,
        },
        showBlackBoard: {
            type: Boolean,
            default: false,
        }
    },
    watch: {
        show: function(newVal, oldVal) {
            if (newVal) {
                this.open();
            } else {
                this.close();
            }
        },
    },
    data: function () {
        return {
            containerStyle: {
                left: -PLEATS_WIDTH + 'px',
            },
            pleatsWidth: PLEATS_WIDTH + 'px',
            pleatsCnt: PLEATS_CNT
            
        }
    },
    methods: {
        open: function() {
            pleatsAni.play();
            this.onCompleteShowWidget();
            // if (this.$refs.widgetVideo)
            //     this.$refs.widgetVideo[0].play();
            // for(var i=0; i<widgetAni.length; i++) {
            //     // widgetAni[i].play();
            //     console.log(i, this.widgets[i].hide);
            //     if (!this.widgets[i].hide) {
            //         widgetAni[i].play();
            //     }
            // }
            
        },
        close: function() {
            pleatsAni.play();
            this.onCompleteShowWidget();
            // if (this.$refs.widgetVideo)
            //     this.$refs.widgetVideo[0].pause();
            // for(var i=0; i<widgetAni.length; i++) {
            //     widgetAni[i].reverse();
            // }
        },
        changeColor: function(data) {
            var p = this.$refs.pleats;
            for(var i =0; i<p.length; i++) {
                p[i].style.backgroundColor = data.value;
            }
        },
        onCompleteShowWidget: function() {
            setTimeout(() => {
                pleatsAni.reverse();
            }, 700)
        },

    },
    created() {
        PLEATS_CNT = parseInt(window.innerWidth / PLEATS_WIDTH * SHIRINK) + 12;
    },
    mounted() {
        console.log('this.widgets', this.widgets);
        var p = this.$refs.pleats;
        var w = this.$refs.widget;
        for(var i =0; i<p.length; i++) {
            p[i].style.left = i * PLEATS_WIDTH * SHIRINK + 'px';
            p[i].style.zIndex = -i;
        }
        
        pleatsAni = TweenMax.to('.pleats', 0.3, {
            boxShadow: "20px 8px 20px rgba(0, 0, 0, 0.5)",
            width: PLEATS_WIDTH * SHIRINK,
            onComplete: this.widgets.length <=0 ? this.onCompleteShowWidget : null,
        }).reverse();
    },
    destroyed() {
    },
}
</script>
<style>
.pleatsContainer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* overflow: hidden; */
    background-color: red;
    z-index: -9999;
}

.pleats {
    position: absolute;
    top: 0;
    left: 0;
    width: 10px;
    height: 110%;
    background-color: rgb(0, 0, 228);
    /* overflow: hidden; */
}

.stayPleats {
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.pleatsMask {
    position: absolute;
    top: 0;
}


.blackBoard {
    position: relative;
    left: 40px;
    top: 0;
    width: 100%;
    height: 100%;
    background: #17382b;
}

.blackBoardIn {
    animation: 1s moveLeft forwards;
}

.blackBoardOut {
    animation: 1s moveRight forwards;
}

@keyframes moveLeft {
    from {
        transform: translateX(100%);
    }
    to {
        transform: translateX(0);
    }
}

@keyframes moveRight {
    from {
        transform: translateX(0%);
    }
    to {
        transform: translateX(100%);
    }
}
</style>
