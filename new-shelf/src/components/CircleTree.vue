<template>
  <div tabindex="-1" ref="container" class="circle">
    <svg viewBox="0 0 550 400" ref="svg" preserveAspectRatio="xMidYMax meet">
        
        <!-- <defs> -->
            <!-- <mask id="photo-mask"> -->
                <g id="stems" ref="stems" fill="none" stroke="green" stroke-width="0.5"></g>
                <g id="leaves" ref="leaves"></g>
            <!-- </mask> -->
        <!-- </defs> -->

        <!-- <image
            mask="url(#photo-mask)"
            xlink:href="../assets/Beige_BG-01.png"
            x="0" y="0"
            width="1920" height="1080" /> -->
    </svg>
  </div>
</template>

<script>
// import gsap from "gsap";
// import _ from "underscore";
import _ from "lodash";
import EventManager from "../utils/Event.js";
import "../utils/DrawSVG.js";
import "../utils/TweenMax.js";
// import TweenMax from "gsap";
// import TweenLite from "gsap";
import 'gsap/CSSPlugin'

var events = new EventManager();
var ns = "http://www.w3.org/2000/svg";
var leafPath  = "M0,0 Q5,-5 10,0 5,5 0,0z";
leafPath = "M6.5,1.8c-0.4-0.4-0.7-0.7-1.1-1L4.9,0.4c0,0-0.1-0.1-0.2-0.1L3.3,0H3.2C2.2,0,1.7,0.1,1,0.9C0.8,1.1,0.6,1.3,0.4,1.4c-0.6,0.4-1.1,1-1.3,1.7c-0.2,1.1,0,2.2,0.4,3.3c0.2,0.6,0.6,1.2,1,1.8c0.1,0.1,0.2,0.2,0.2,0.4C1,9.2,1.4,9.9,2.3,10c0.2,0,0.5,0,0.7,0c1.8,0.1,3.6-1,4.3-2.7C8.1,5.5,7.8,3.3,6.5,1.8z";
var ctx, stems, leaves, svg;
var leafCount = 20;
var plants    = 100;
var centerX   = 275;
var offsetX   = 400;

var colorMap = [
    '104, 116, 63',
    '106, 187, 139',
    '25, 82, 42',
    '172, 186, 120',
    '75, 143, 72'
];

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

function solve(data) {
  var size = data.length;
  var last = size - 4;    

  var path = "M" + [data[0], data[1]];

  for (var i = 0; i < size - 2; i +=2) {

    var x0 = i ? data[i - 2] : data[0];
    var y0 = i ? data[i - 1] : data[1];

    var x1 = data[i + 0];
    var y1 = data[i + 1];

    var x2 = data[i + 2];
    var y2 = data[i + 3];

    var x3 = i !== last ? data[i + 4] : x2;
    var y3 = i !== last ? data[i + 5] : y2;

    var cp1x = (-x0 + 6 * x1 + x2) / 6;
    var cp1y = (-y0 + 6 * y1 + y2) / 6;

    var cp2x = (x1 + 6 * x2 - x3) / 6;
    var cp2y = (y1 + 6 * y2 - y3) / 6;
   
    path += "C" + [cp1x, cp1y, cp2x, cp2y, x2, y2];
  } 
  return path;
}

export default {
  name: 'CircleTree',
  props: {
    msg: String
  },
  methods: {
    keyDown: function() {
    },
    draw: function() {
        console.log('draw');
        // this.createBranch();
        stems = this.$refs.stems;
        leaves = this.$refs.leaves;
        svg = this.$refs.svg;
        this.generate();
    }, 
    generate: function() {
        _.times(plants, this.createPlant);
        stems.children.forEach(function(el) {
            var tween = TweenMax.to(el, _.random(2, 4, true), {
            drawSVG: true,    
            delay: _.random(2, true),
            onStart: () => {
                return TweenMax.set(el, { opacity: 1 })
            },
            onUpdate: () => {
                events.fire(el.id, tween.progress())
            }});
        });
    },
    createPlant: function() {
        var points = this.createPoints();
        var stem   = this.createPath(stems);
        var length = points.length;  
        var values = points.map(point => `${point.x},${point.y}`);
        var height = points[length - 1].y;   
        var id     = _.uniqueId("grow");   
        var coords = [];
        
        for (var i = 0; i < length; i++) {
            var point = points[i];
            coords.push(point.x, point.y);
        }
        
        TweenMax.set(stem, {     
            opacity: 0,
            drawSVG: 0,
            //attr: { id, d: `M${values.join(" ")}` }
            attr: { id, d: solve(coords) }
        });
        // console.log(points);
        for (var i = 0; i < leafCount; i++) {
            var point = points[length - 1 - i];    
            var scale = {
            x: 0.8 + 0.00001  * i,
            y: 0.8 + 0.00005 * i
            };
            // console.log(point);
            this.createLeaf(point, scale, height, id);
        }    
    },
    createPoints: function() {
        var x = _.random(centerX - offsetX, centerX + offsetX);
        var y = 0;
        var dy = 5;  
        var offset = 0.007;
        var count  = _.random(30, 55);
        var points = [{ x, y }];
            
        for (var i = 1; i <= count; i++) {
            var p = {
            x: points[i - 1].x + i * offset * (_.random(21) - 10),
            y: 5 + dy * i
            };
            points.push(p);

        }
        return points;
    },
    createPath: function(parent) {
        return parent.appendChild(document.createElementNS(ns, "path"));
    },
    createLeaf: function(point, scale, height, grow) {
        // console.log(point, scale, height, grow);
        var leaf  = this.createPath(leaves);   
        var start = point.y / height;  // 
        var off   = events.on(grow, growLeaf);
        function growLeaf(growth) {
            if (growth >= start) {
                // Remove listener
                off();
                TweenMax.set(leaf, {
                    x: point.x,
                    y: point.y,
                    scaleX: scale.x,
                    scaleY: scale.y,
                    rotation: _.random(180) - 180,
                    fill: `rgba(${getRandomInt(36, 130)}, ${169}, ${50},
                        ${Math.random().toFixed(1)})`,
                    // fill: "white",
                    attr: { d: leafPath }        
                });
                
                TweenMax.from(leaf, 1, { scale: 0 });
            }
        }
    }
  },
  mounted() {
    console.log('mounted');
    this.draw();
  },
  destroyed() {
  }
}
</script>

<style scoped>
body {
  background: #eee;
}

* {
  box-sizing: border-box;
}

svg {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;  
  position: absolute;
}

.circle {
    position: absolute;
    left: 0;
    top: 0;
    /* background-color: navy; */
    width: 100%;
    height: 100%;
}
</style>
