<template>
    <div class="kaws" ref="container">
    </div>
</template>
<script>
const CNT = 30;
const IMG_W = 222;
const IMG_H = 172;

import _ from "lodash";
import { setTimeout, setInterval, clearInterval } from 'timers';
import "../utils/TweenMax.js";
import EventManager from "../utils/Event.js";

var events = new EventManager();
var timer;
var floatEls = [];
function Particle(el) {
    this.el = el;
    this.vx = (Math.random()) - 0.5;
    this.vy = (Math.random()) - 0.5;
}
function random(min, max) {
  const delta = max - min;
  return (direction = 1) => {
      var r = (min + delta * Math.random()) * direction;
    //   console.log('random ', r);
      return r;
  }
}
const randomX = random(10, 20);
const randomY = random(20, 30);
const randomDelay = random(0, 1);
const randomTime = random(3, 5);
const randomTime2 = random(5, 10);
const randomAngle = random(8, 12);

export default {
    name: 'Kaws',
    methods: {
        createPoint: function(id) {
            var el = document.createElement("img");
            this.$refs.container.appendChild(el);
            el.style.position = "fixed";
            el.style.visibility = "hidden"
            el.src = require("../assets/kaws.png");
            el.width = IMG_W;
            el.height = IMG_H;

            var x = _.random(-window.innerWidth/2 - IMG_W/2, window.innerWidth/2);
            var y = _.random(-IMG_H/2, window.innerHeight);
            var scaleX = 0.5 + 0.003 * _.random(3, 10);
            var scaleY = 0.5 + 0.003 * _.random(3, 10);
            
            var off = events.on(id, grow);
            var that = this;

            function moveX(target, direction) {
                var trans = target.style.transform;
                var value = trans.match(/-?\d+\.?\d*/g);
                // console.log(value);
                TweenMax.to(target, randomTime(), {
                    x: parseInt(value[4]) + randomX(direction),
                    // y: parseInt(value[5]) + randomY(direction),
                    ease: Sine.easeInOut,
                    onComplete: moveX,
                    onCompleteParams: [target, direction * -1]
                });
            }

            function moveY(target, direction) {
                var trans = target.style.transform;
                var value = trans.match(/-?\d+\.?\d*/g);

                TweenLite.to(target, randomTime(), {
                    y: parseInt(value[5]) + randomY(direction),
                    ease: Sine.easeInOut,
                    onComplete: moveY,
                    onCompleteParams: [target, direction * -1]
                });
            }

            function rotate(target, direction) {
                TweenLite.to(target, randomTime2(), {
                    rotation: randomAngle(direction),
                    // delay: randomDelay(),
                    ease: Sine.easeInOut,
                    onComplete: rotate,
                    onCompleteParams: [target, direction * -1]
                });
            }

            function grow(growth) {
                off();
                TweenMax.set(el, {
                    visibility: "inherit",
                    x,
                    y,
                    scaleX,
                    scaleY,
                    // rotation: _.random(180) - 180,
                });
                TweenMax.from(el, 1, {
                    scale: 0,
                    onComplete: function() {
                        var trans = el.style.transform;
                        var value = trans.match(/-?\d+\.?\d*/g);

                        moveX(el, 1);
                        moveY(el, -1);
                        rotate(el, 1);
                    }
                })
            }
        },
        generate: function() {
            for(var i =0; i<CNT; i++) {
                this.createPoint(i);
            }
            var start = 0;
            timer = setInterval(() => {
                events.fire(start);
                start++;
                if (start >= CNT) 
                    clearInterval(timer);
            }, 100);
        },
        startFloat: function() {

        }
    },
    mounted() {
        this.generate();
        this.startFloat();
    },
}
</script>
<style>
.kaws {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: navy;
}
</style>
