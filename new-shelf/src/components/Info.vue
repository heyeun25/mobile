<template>
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
                loop
                ref="widgetVideo"
                v-if="item.video"
                v-bind:id="'w'+index"
                v-bind:width="item.style.width"
                v-bind:src="getVideo(item.video)"
                v-bind:style="{'transform': 'translateX(-100%)'}"
                type="video/webm"/>
        </div>
    </div>
</template>
<script>
import {TweenMax, Power0} from "gsap"

var widgetAni = [];
export default {
    name: 'Info',
    props: {
        stopWidgetVideo: {
            type: Boolean,
            default: false
        },
        widgets: Array,
        dir: String,
        show: Boolean,
        videoStartTime: String,
    },
    watch: {
        stopWidgetVideo: function(newVal) {
            if (newVal) {
                this.$refs.widgetVideo[0].pause();
            } else if (!newVal&& this.show){
                this.$refs.widgetVideo[0].play();
            }
        },
        show: function(newVal, oldVal) {
            if (newVal) {
                this.open();
            } else {
                this.close();
            }
        },
    },
    methods: {
        getVideo: function(filename) {
            return require(`../assets/video/${filename}`);
        },
        getImage: function(filename) {
            console.log("this.dir", this.dir)
            return require(`../assets/${this.dir}/${filename}`);
        },
        addWidget: function() {
            console.log('addWidget', widgetAni);
            widgetAni[9].play();
            this.widgets[9].hide = false;
        },
        open: function() {
            console.log('open');
            if (this.$refs.widgetVideo)
                this.$refs.widgetVideo[0].play();
            for(var i=0; i<widgetAni.length; i++) {
                if (!this.widgets[i].hide) {
                    widgetAni[i].play();
                }
            }
        },
        close: function() {
            console.log('close');
            if (this.$refs.widgetVideo)
                this.$refs.widgetVideo[0].pause();
            for(var i=0; i<widgetAni.length; i++) {
                widgetAni[i].reverse();
            }
        },
    },
    mounted() {
        var w = document.getElementsByClassName('widget');
        if (this.videoStartTime)
            this.$refs.widgetVideo[0].currentTime = Number(this.videoStartTime);
        console.log(w);
        for(var i=0; i<w.length; i++) {
            widgetAni.push(TweenMax.to(w[i], 0.3, {
                translateX: 0,
                ease: Power0.easeInOut,
            }).reverse());
        }
    },
    destroyed() {
        widgetAni = [];
    },
}
</script>
<style>
.widgetContainer {
    position: absolute;
    overflow: hidden;
}

.widget {
    position: absolute;
}

.topUI {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
}

.test {
    position: absolute;
    top: 0;
    left: 0;
    outline: 1px solid yellow;
}
</style>
