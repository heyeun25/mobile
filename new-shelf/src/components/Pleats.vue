<template>
    <div class="pleatsContainer" ref="pleatsContainer" v-bind:style="containerStyle">
        <div class="pleats" ref="pleats"
                v-bind:key="'p' + index"
                v-for="(item, index) in items"
                v-bind:id="'p' + index"
                v-bind:style="{
                    backgroundColor: color, 
                    width: pleatsWidth}">
            <div class="widget" ref="widget"
                v-for="(iitem, index) in item"
                v-bind:style="iitem.style"
                v-bind:key="'w' + index"
                v-bind:id="'w' + iitem.index + '-' + iitem.subIndex">
                <img class="widgetImage"
                    v-if="iitem.style.backgroundImage"
                    v-bind:style="{'width': iitem.style.width,
                                'height': iitem.style.height}"
                    v-bind:src="getImage(iitem.style.backgroundImage)"/>
                <video class="widgetVideo"
                    controls
                    ref="widgetVideo"
                    v-if="iitem.video"
                    v-bind:width="iitem.style.width"
                    v-bind:src="getVideo(iitem.video)"
                    type="video/webm"/>
            </div>
        </div>
        <div class="topUI" ref="topUI"></div>
        <div v-bind:class="'blackBoard'+(blackBoard ? blackBoardIn : blackBoardOut)"
            ref="blackBoard">
        </div>
    </div>
</template>
<script>
import TweenMax from "gsap"
import { setTimeout } from 'timers'

const PLEATS_WIDTH = 39;
const WIDGET_WIDTH = 300;
const SHIRINK = 0.95;
var PLEATS_CNT = 140;

var pleatsAni;
var widgetAni = [];
function findPos(obj)
{
    var curLeft=0, curTop=0;
    console.log(obj.offsetParnet);
    if (obj.offsetParent) {
        do {
            curLeft += obj.offsetLeft;
            curTop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    }
    return {'left': curLeft, 'top': curTop};
}
export default {
    name: 'Pleats',
    props: {
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
        blackBoard: Boolean,
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
            // widgets: widgetData.widgets,
            items: [],
            
        }
    },
    methods: {
        moveWidgetToTop: function() {
            var pleatsEls = document.getElementsByClassName('pleats');
            var parent = [];
            for(var i =0; i<pleatsEls.length; i++) {
                if (pleatsEls[i].children.length > 0) {
                    parent.push(pleatsEls[i]);
                }
            }
            console.log(parent);
            for(var i =0; i<parent.length; i++) {
                for(var j =0; j<parent[i].childNodes.length; j++) {
                    var c = parent[i].childNodes[j]
                    // console.log(c.offsetLeft, c.offsetTop);
                    console.log('style ', c.style.cssText);
                    console.log('static ', c.getBoundingClientRect());
                // }
                }
            }

            for(var i =0; i<parent.length; i++) {
                while(parent[i].childNodes.length > 0) {
                    var c = parent[i].childNodes[0];
                    var staticValue = c.getBoundingClientRect();
                    this.$refs.topUI.appendChild(c);
                    var staticValue2 = c.getBoundingClientRect();
                    console.log(staticValue, staticValue2);
                }
            }

        },
        checkItem: function(item, property) {
            // console.log('checkitem', item.style.backgroundImage);
            return item.style[property]
        },
        parseWidgets: function(widgets) {
            var result = this.items;
            for(var i =0; i<widgets.length; i++) {
                var idx = widgets[i].index;
                result[idx].push(widgets[i]);
            }
            this.items = result;
            // console.log(this.items);
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
                widgetAni[i].play();
                if (widgetAni[i]._targets[0].id == "w50-1") {
                    widgetAni[i].reverse();
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
            console.log('complete');;
            this.moveWidgetToTop();
            setTimeout(() => {
                pleatsAni.reverse();
            }, 500)
        },
        addWidget: function() {
            console.log('addWidget', widgetAni);
            var el = document.getElementById("w50-1");
            el.style.backgroundImage = "memo_b.png";
            for(var i =0; i<widgetAni.length; i++) {
                if (widgetAni[i]._targets[0].id == "w50-1") {
                    widgetAni[i].play();
                }
            }
        }
    },
    created() {
        PLEATS_CNT = parseInt(window.innerWidth / PLEATS_WIDTH * SHIRINK) + 12;
        console.log('pleatscnt=', PLEATS_CNT);
        for(var i =0; i<PLEATS_CNT; i++) {
            this.items[i] = [];
        }
        this.parseWidgets(this.widgets);
    },
    mounted() {
        console.log('this.widgets', this.widgets);
        var p = this.$refs.pleats;
        var w = this.$refs.widget;
        for(var i =0; i<p.length; i++) {
            p[i].style.left = i * PLEATS_WIDTH * SHIRINK + 'px';
            p[i].style.zIndex = -i*2;
            // (w && w[i]) ? w[i].style.zIndex = -i*2-1 : null;
        }
        
        pleatsAni = TweenMax.to('.pleats', 0.3, {
            boxShadow: "20px 8px 20px rgba(0, 0, 0, 0.5)",
            width: PLEATS_WIDTH * SHIRINK,
            onComplete: this.widgets.length <=0 ? this.onCompleteShowWidget : null,
        }).reverse();

        for(var i=0; i<this.widgets.length; i++) {
            var w = this.widgets[i];
            var id = "#w" + w.index + "-" + w.subIndex;
            widgetAni.push(TweenMax.to(id, 0.1, {
                translateX: w.translateX,
                onComplete: (i == 0 ? this.onCompleteShowWidget : null),
                onReverseComplete: (i == 0 ? this.onCompleteShowWidget : null),
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
    /* outline: 1px solid red; */
    width: 10px;
    height: 110%;
    background-color: rgb(0, 0, 228);
    /* box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5); */
}

.widget {
    /* position: relative; */
    position: absolute;
}

.topUI {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}

.blackBoard {
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #17382b;
    z-index: -50;
}

.blackBoardIn {
    animation: 1s moveLeft forwards;
}

.blackBoardOut {
    animation: 1s moveRight forwards;
}

@keyframes moveLeft {
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(-100%);
    }
}

@keyframes moveRight {
    from {
        transform: translateX(-100%);
    }
    to {
        transform: translateX(0);
    }
}
</style>
