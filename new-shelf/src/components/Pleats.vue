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
        
    </div>
</template>
<script>
import {setTimeout} from 'timers'
import TweenMax from "gsap"
const PLEATS_WIDTH = 40;
const WIDGET_WIDTH = 300;
const SHIRINK = 0.95;
var PLEATS_CNT = 140;

var pleatsAni;
var widgetAni = [];
const lines = [76, 77, 78, 79, 83, 84, 85, 86, 90, 91, 92, 93];
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
        },
        pleatsItemColor: String,
    },
    watch: {
        show: function(newVal, oldVal) {
            if (newVal) {
                this.open();
            } else {
                this.close();
            }
        },
        pleatsItemColor: function(newVal) {
            if (newVal.length <= 0) {
                console.log('error');
                return;
            }
            for(var i =0; i<lines.length; i++) {
                var p = document.getElementById(`p${lines[i]}`);
                p.style.backgroundColor = newVal;
            }
        }
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
            
        },
        close: function() {
            pleatsAni.play();
            this.onCompleteShowWidget();
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
        
        pleatsAni = TweenMax.to('.pleats', 1, {
            boxShadow: "20px 8px 20px rgba(0, 0, 0, 0.8)",
            width: PLEATS_WIDTH * SHIRINK,
            onComplete: this.widgets.length <=0 ? this.onCompleteShowWidget : null,
        }).reverse();

        if (this.pleatsItemColor &&
            this.pleatsItemColor.length >= 0) {
            for(var i =0; i<lines.length; i++) {
                var p = document.getElementById(`p${lines[i]}`);
                p.style.backgroundColor = this.pleatsItemColor;
            }
        }
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
    box-shadow: 0px 0px 0px black;    
    /* overflow: hidden; */
}

.stayPleats {
    box-shadow: 10px 5px 10px rgba(0, 0, 0, 0.5);
}

.pleatsMask {
    position: absolute;
    top: 0;
}


</style>
