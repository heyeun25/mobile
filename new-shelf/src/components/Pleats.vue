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
        <div class="topUI" ref="topUI">
            <div class="widgetContainer"
                v-for="(item, index) in widgets"
                v-bind:key="'wc'+index"
                v-bind:id="'wc'+index"
                v-bind:style="item.style">
                <img class="widget"
                    v-bind:id="'w'+index"
                    v-if="item.style.backgroundImage"
                    v-bind:style="{'width': item.style.width,
                                'height': item.style.height,
                                'transform': 'translateX(-100%)'}"
                    v-bind:src="getImage(item.style.backgroundImage)"/>
                <video class="widget"
                    controls
                    ref="widgetVideo"
                    v-if="item.video"
                    v-bind:id="'w'+index"
                    v-bind:width="item.style.width"
                    v-bind:src="getVideo(item.video)"
                    type="video/webm"/>
            </div>
        </div>
        
    </div>
</template>
<script>
import TweenMax from "gsap"
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
        stopWidgetVideo: {
            type: Boolean,
            default: false
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
                // if (this.$refs.myVideo)
                    // this.$refs.myVideo.pause();
            }
        },
        stopWidgetVideo: function(newVal) {
            if (newVal) {
                this.$refs.widgetVideo[0].pause();
            } else if (!newVal&& this.show){
                this.$refs.widgetVideo[0].play();
            }
        }
    },
    data: function () {
        return {
            containerStyle: {
                left: -PLEATS_WIDTH + 'px',
            },
            pleatsWidth: PLEATS_WIDTH + 'px',
            items: [],
            pleatsCnt: PLEATS_CNT
            
        }
    },
    methods: {
        checkItem: function(item, property) {
            // console.log('checkitem', item.style.backgroundImage);
            return item.style[property]
        },
        getVideo: function(filename) {
            return require(`../assets/video/${filename}`);
        },
        getImage: function(filename) {
            return require(`../assets/${this.dir}/${filename}`);
        },
        open: function() {
            pleatsAni.play();
            if (this.$refs.widgetVideo)
                this.$refs.widgetVideo[0].play();
            for(var i=0; i<widgetAni.length; i++) {
                // widgetAni[i].play();
                console.log(i, this.widgets[i].hide);
                if (!this.widgets[i].hide) {
                    widgetAni[i].play();
                }
            }
            
        },
        close: function() {
            pleatsAni.play();
            if (this.$refs.widgetVideo)
                this.$refs.widgetVideo[0].pause();
            for(var i=0; i<widgetAni.length; i++) {
                widgetAni[i].reverse();
            }
        },
        changeColor: function(data) {
            var p = this.$refs.pleats;
            for(var i =0; i<p.length; i++) {
                p[i].style.backgroundColor = data.value;
            }
        },
        showWidget: function(index) {
            for(var i =0; i<this.widgets.length; i++) {
                if (this.widgets[i].index == index) {
                    return true;
                }
            }
            return false;
        },
        getWidgetStyle: function(index) {
            for(var i =0; i<this.widgets.length; i++) {
                if (this.widgets[i].index == index) {
                    var s = this.widgets[i].style;
                    // if (s.backgroundImage) {
                        s = {...s, ...{
                            backgroundImage: require('../assets/health/H_1_a.png'),
                            backgroundSize: 'cover'
                        }}
                    // }
                    console.log(s);
                    return s;
                }
            }
            return {};
        },
        onCompleteShowWidget: function() {
            console.log('onCompleteShowWidget')
            setTimeout(() => {
                pleatsAni.reverse();
            }, 500)
        },
        onCompleteReverse: function() {
            setTimeout(() => {
                pleatsAni.reverse();
            }, 500)
        }, 
        addWidget: function() {
            console.log('addWidget', widgetAni);
            widgetAni[9].play();
            this.widgets[9].hide = false;
        }
    },
    created() {
        PLEATS_CNT = parseInt(window.innerWidth / PLEATS_WIDTH * SHIRINK) + 12;
        // console.log('pleatscnt=', PLEATS_CNT);
        // for(var i =0; i<PLEATS_CNT; i++) {
        //     this.items[i] = [];
        // }
        // this.parseWidgets(this.widgets);
    },
    mounted() {
        console.log('this.widgets', this.widgets);
        var p = this.$refs.pleats;
        var w = this.$refs.widget;
        for(var i =0; i<p.length; i++) {
            p[i].style.left = i * PLEATS_WIDTH * SHIRINK + 'px';
            p[i].style.zIndex = -i;
            // (w && w[i]) ? w[i].style.zIndex = -i*2-1 : null;
        }
        
        pleatsAni = TweenMax.to('.pleats', 0.3, {
            boxShadow: "20px 8px 20px rgba(0, 0, 0, 0.5)",
            width: PLEATS_WIDTH * SHIRINK,
            onComplete: this.widgets.length <=0 ? this.onCompleteShowWidget : null,
        }).reverse();

        // for(var i=0; i<this.widgets.length; i++) {
        //     var w = this.widgets[i];
        //     var id = "#w" + w.index + "-" + w.subIndex;
        //     widgetAni.push(TweenMax.to(id, 0.1, {
        //         translateX: w.translateX,
        //         onComplete: ((i == 0 || this.checkHide(id)) ? this.onCompleteShowWidget : null),
        //         onReverseComplete: (i == 0 ? this.onCompleteReverse : null),
        //     }).reverse());
        // }

        var w = document.getElementsByClassName('widget');
        for(var i=0; i<w.length; i++) {
            widgetAni.push(TweenMax.to(w[i], 0.5, {
                translateX: 0,
                onComplete: ((i == 0 || this.widgets[i].hide)) ? this.onCompleteShowWidget : null,
                onReverseComplete: ((i == 0 || this.widgets[i].hide)) ? this.onCompleteReverse : null,
            }).reverse());
        }
    },
    destroyed() {
        widgetAni = [];
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
    background-color: black;
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

.widgetContainer {
    position: absolute;
    overflow: hidden;
}

.widget {
    /* position: relative; */
    position: absolute;
}

.topUI {
    position: absolute;
    left: 40px;
    top: 0;
    width: 100%;
    height: 100%;
    z-Index: 999;
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
