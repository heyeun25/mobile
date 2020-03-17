<template>
    <div class="character" ref="container">
    </div>
</template>
<script>
import _ from "lodash";
import { setTimeout, setInterval, clearInterval } from 'timers';
import "../utils/TweenMax.js";
import EventManager from "../utils/Event.js";
const CNT = 80;
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
    name: 'Character',
    props: {
        'number': Number,
        'imgSize': Object,
        'imgSrc': String,
    },
    watch: {
        imgSrc: function (newVal) {
            // Reset Doms
            var container = this.$refs.container;
            while (container.firstChild) {
                container.removeChild(container.lastChild);
            }
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
            this.generate();
        }
    },
    methods: {
        createPoint: function(id) {
            var el = document.createElement("img");
            this.$refs.container.appendChild(el);
            el.style.position = "absolute";
            el.style.visibility = "hidden"
            el.src = require(`../assets/${this.imgSrc}`);
            console.log(this.imgSize);
            el.width = this.imgSize.w;
            el.height = this.imgSize.h;

            var x = _.random(-window.innerWidth/2 - this.imgSize.w/2, window.innerWidth/2);
            var y = _.random(-this.imgSize.h/2, window.innerHeight);
            var scaleX = 150 / (this.imgSize.w * 2) + 0.01 * _.random(10, 20);
            // var scaleY = 0.8 + 0.003 * _.random(3, 10);
            var off = events.on(id, popCharacter);
            var that = this;

            function popCharacter(process) {
                off();
                TweenMax.set(el, {
                    visibility: "inherit",
                    x,
                    y,
                    scaleX,
                    scaleY: scaleX,
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
        },
        generate: function() {
            for(var i =0; i<CNT; i++) {
                this.createPoint(i);
            }
            var start = 0;
            timer = setInterval(() => {
                events.fire(start);
                start++;
                if (start >= CNT) {
                    clearInterval(timer);
                    timer = null;
                }
            }, 100);
        },
    },
    mounted() {
        console.log('character mounted');
        this.generate();
    },
}
</script>
<style>
.character {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    /* background-color: navy; */
}
</style>
