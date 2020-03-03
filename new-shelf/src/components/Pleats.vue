<template>
    <div class="container" ref="container">
        <div class="pleats" ref="pleats"
            v-for="index in 40" v-bind:key="'p' + index"
            v-bind:style="{backgroundColor: color}">
        </div>
        <div class="widget" ref="widget"
            v-for="index in 1" v-bind:key="'w' + index">
        </div>

    </div>
</template>
<script>
const PLEATS_CNT = 40;
const PLEATS_WIDTH = 40;
const WIDGET_WIDTH = 300;

var animation;
var widgetAni;
import TweenMax from "gsap";
import { setTimeout } from 'timers';
export default {
    name: 'Pleats',
    props: ['show', 'color'],
    watch: {
        show: function(newVal, oldVal) {
            // console.log('newVal', newVal);
            if (newVal) this.open(); 
            else this.close();
        }
    },
    methods: {
        open: function() {
            setTimeout(() => {
                animation.play();
                widgetAni.play();
            }, 1000)
        },
        close: function() {
            animation.reverse();
            widgetAni.reverse();
        },
        changeColor: function(data) {
            var p = this.$refs.pleats;
            for(var i =0; i<p.length; i++) {
                p[i].style.backgroundColor = data.value;
            }
        }
    },
    mounted() {
        // this.$socket.on('appMsg', this.changeColor);
        var p = this.$refs.pleats;
        var w = this.$refs.widget;
        for(var i =0; i<p.length; i++) {
            p[i].style.left = i * PLEATS_WIDTH + 'px';
            p[i].style.zIndex = (p.length-i)*2;
            w[i] ? w[i].style.zIndex = (p.length-1-i)*2 : null;
        }
        
        console.log('w', w.length);
        for(var i =0; i<w.length; i++) {
            w[i].style.left = i * PLEATS_WIDTH - WIDGET_WIDTH + 'px';
            
        }

        animation =TweenMax.to('.pleats', 0.2, {
            boxShadow: "10px 5px 15px rgba(0, 0, 0, 0.5)",
            width: PLEATS_WIDTH,
        }).reverse();

        widgetAni = TweenMax.to(".widget", 0.5, {
            translateX: WIDGET_WIDTH + 100,
        }).reverse();
        // this.open();
    },
    destroyed() {
        // this.$socket.off('appMsg', this.changeColor);
    },
}
</script>
<style>
.container {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}

.pleats {
    position: absolute;
    top: -20px;
    left: 0;
    width: 50px;
    height: 120%;
    background-color: rgb(0, 0, 228);
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.widget {
    position: absolute;
    top: 100px;
    width: 300px;
    height: 500px;
    background-color:rgb(187, 153, 91);
    outline: 1px solid black;
}
</style>
