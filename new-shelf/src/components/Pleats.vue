<template>
    <div class="pleatsContainer" ref="pleatsContainer" v-bind:style="containerStyle">
        <div class="pleats" ref="pleats"
                v-bind:key="'p' + index"
                v-for="index in 140"
                v-bind:id="'p' + index"
                v-bind:style="{
                    backgroundColor: color, 
                    width: pleatsWidth}">
            <div class="widget" ref="widget"
                v-if="showWidget(index)"
                v-bind:style="getWidgetStyle(index)"
                v-bind:key="'w' + index"
                v-bind:id="'w' + index">
            </div>
        </div>
    </div>
</template>
<script>
import TweenMax from "gsap"
import { setTimeout } from 'timers'

const PLEATS_WIDTH = 40;
const WIDGET_WIDTH = 300;
const SHIRINK = 0.95;
var PLEATS_CNT = 140;

var pleatsAni;
var widgetAni = [];

export default {
    name: 'Pleats',
    props: {
        show: Boolean,
        color: String,
        widgets: {
            type: Array,
            default: () => [],
        }
    },
    watch: {
        show: function(newVal, oldVal) {
            if (newVal) this.open(); 
            else this.close();
        }
    },
    data: function () {
        return {
            containerStyle: {
                left: -PLEATS_WIDTH + 'px',
            },
            pleatsWidth: PLEATS_WIDTH + 'px',
            // widgets: widgetData.widgets,
        }
    },
    methods: {
        open: function() {
            pleatsAni.play();
            for(var i=0; i<widgetAni.length; i++) {
                widgetAni[i].play();
            }
        },
        close: function() {
            pleatsAni.play();
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
                    return this.widgets[i].style;
                }
            }
            return {};
        },
        onCompleteShowWidget: function() {
            console.log('complete');;
            setTimeout(() => {
                pleatsAni.reverse();
            }, 500)
        },
        addWidget: function(widget) {
            console.log('addWidget');
            this.widgets.push(widget);
            this.widgetAni.push(TweenMax.to("#w" + widget.index, 0.1, {
                translateX: widget.translateX,
            }).reverse())
            this.open();
        },
        addMirroring: function() {
            console.log('addMirroring');
            // move current widgets
            TweenMax.to('.widget', )
            this.addWidget({
                
            })
        },
        removeMirroring: function() {
            console.log('removeMirroring');
        },
        
    },
    mounted() {
        console.log('this.widgets',);
        PLEATS_CNT = window.innerWidth / PLEATS_WIDTH * SHIRINK;
        var p = this.$refs.pleats;
        var w = this.$refs.widget;
        for(var i =0; i<p.length; i++) {
            p[i].style.left = i * PLEATS_WIDTH * SHIRINK + 'px';
            p[i].style.zIndex = -i*2;
            (w && w[i]) ? w[i].style.zIndex = -i*2-1 : null;
        }
        
        pleatsAni = TweenMax.to('.pleats', 0.3, {
            boxShadow: "20px 8px 20px rgba(0, 0, 0, 0.5)",
            width: PLEATS_WIDTH * SHIRINK,
            onComplete: this.widgets.length <=0 ? this.onCompleteShowWidget : null,
        }).reverse();

        for(var i=0; i<this.widgets.length; i++) {
            widgetAni.push(TweenMax.to("#w" + this.widgets[i].index, 0.1, {
                translateX: this.widgets[i].translateX,
                onComplete: (i == 0 ? this.onCompleteShowWidget : null),
                onReverseComplete: (i == 0 ? this.onCompleteShowWidget : null),
            }).reverse());
        }
        // this.open();
    },
    destroyed() {
        widgetAni = [];
        // this.$socket.off('appMsg', this.changeColor);
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
    position: relative;
}
</style>
