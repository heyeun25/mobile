<template>
  <div id="app" v-bind:style="{backgroundColor: appColor}">
    <img class="bg-pattern"/>
    <transition :name="transitionName" :duration="300">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
var demoList = [
  {name: "init", data: {func: 'concept', value: {init: true}}},
  {name: "concept", data: {func: 'concept', value: {showConcept: true}}},
  {name: "concept", data: {func: 'concept', value: {playVideo: true}}},
  {name: "concept", data: {func: 'concept', value: {showConcept: false}}},
  // {name: "changeAppColor", data: {func: 'appColor', value: 'red'}},
  {name: "goDisplayShelf", data: {func: 'displayShelf'}},
  {name: "skin", data: {func: 'displayShelf', value: {skin: true, index: -1}}},
  {name: "skin", data: {func: 'displayShelf', value: {skin: true, index: 0, clock: true, clockIdx: 0}}},
  {name: "skin", data: {func: 'displayShelf', value: {skin: true, index: 1, clock: true, clockIdx: 1}}},
  {name: "skin", data: {func: 'displayShelf', value: {skin: true, index: 2, clock: true, clockIdx: 2}}},
];
var demoIdx = 0;
export default {
  name: 'app',
  components: {
  },
  watch: {
      '$route' (to, from) {
          if (to.name.indexOf('equalizer') > -1)
            this.transitionName = 'fade';
          else if (to.name.indexOf('displayShelf') > -1) 
            this.transitionName = '';
          else
            this.transitionName = 'fade';
          console.log('transition', this.transitionName);
      }
  },
  data() {
    return {
      transitionName: 'fade',
      bgClasses: [
          'bg_check', 'bg_paulsmith', 'bg_fabric', 'bg_wall'
      ],
      bgIdx: 3,
      appColor: 'white',
    }
  },
  mounted: function() {
    const socket = this.$socket;
    this.$socket.on('connect', function() {
      socket.emit('identify', 'shelf');
    });

    const myRouter = this.$router;
    var that = this;
    this.$socket.on('appMsg', function(d) {
      console.log('appMsg', myRouter.currentRoute.name, d.func);
      if (d.func == 'appColor') {
        console.log('change appColor');
        that.appColor = d.value;
        return;
      }

      if (myRouter.currentRoute.name !== d.func) {
        console.log('change');
        myRouter.push({name: d.func, params: d.value})
      }
    });

    window.addEventListener('keydown', this.onKeyDown);
    this.updateBodyBG();
  },
  beforeDestroy() {
  },
  methods: {
    updateBodyBG() {
      document.body.className = this.bgClasses[this.bgIdx];
    },
    start: function() {
      console.log('start');
      this.$refs.startBtn.style.visibility = "hidden";
    },
    onKeyDown(e) {
      console.log(e.key, typeof(e.key));

      switch(e.key) {
        case 'Escape':
          demoIdx = 0;
          this.send(demoList[demoIdx].data);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          var newIdx = Math.max(0, demoIdx-1);
          if(newIdx !== demoIdx) {
            demoIdx = newIdx;
            this.send(demoList[demoIdx].data);
          }
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          var newIdx = Math.min(demoList.length-1, demoIdx+1);
          if(newIdx !== demoIdx) {
            demoIdx = newIdx;
            this.send(demoList[demoIdx].data);
          }
          break;
        case 'b':
          this.bgIdx = (this.bgIdx+1) % this.bgClasses.length;
          this.updateBodyBG();
          break;
      }
    },
    send: function(data) {
      console.log(JSON.stringify(data));
      if (data.func == 'mobile') {
        this.$socket.emit('controller', data);
        return;
      }
      this.$socket.emit('appMsg', data);
    }
  },
}
</script>

<style>
body, html {
  left: 0;
  top: 0;
  margin: 0;
}
body {
  background-color: black;
}

body.bg_check {
  background-image: url('./assets/shelf_BG_green_final.png');
  /*background-position: 269px 254px;
  background-size: 3319px 1972px;*/
  background-position: 0px 0px;
  background-size: 3840px 2160px;
  background-color: transparent;
  background-repeat: no-repeat;
}
body.bg_paulsmith {
  background-image: url('./assets/shelf_BG_paulsmith.png');
  /*background-position: 0px 0px;
  background-size: 4000px 2160px;*/
  background-position: 0px 0px;
  background-size: 3840px 2160px;
  background-color: transparent;
  background-repeat: no-repeat;
}
body.bg_wall {
  background-image: url('./assets/shelf_BG_wall.png');
  background-position: 0px 0px;
  background-size: 3840px 2160px;
  background-color: transparent;
  background-repeat: no-repeat;
}
body.bg_fabric {
  background-image: url('./assets/shelf_BG_navy.png');
  background-position: 0px 0px;
  background-size: 3840px 2160px;
  background-color: transparent;
  background-repeat: no-repeat;
}

#app {
  transform: scale(0.86, 0.88) translate(262px, 276px);
  transform-origin: top left;
  width: 100%;
  height: 100%;
  position: fixed;
  /* left: 262px;
  top: 276px;
  width: 3321px;
  height: 1879px; */
  outline: 5px solid red;
  overflow: hidden;
}

.bg-pattern {
  width: 100%;
  height: 100%;
  
  background: url('./assets/Shelf_BG.png');
  mix-blend-mode: multiply;
}

@font-face {
  font-family: 'SamsungSharpSans';
  src: url('./assets/SamsungSans-Light.ttf');
}

@font-face {
  font-family: "SOU-200";
  src:url('./assets/fonts/SamsungOneUI-200 V3.0.ttf');
}
@font-face {
  font-family: "SOU-300";
  src:url('./assets/fonts/SamsungOneUI-300 V3.0.ttf');
}
@font-face {
  font-family: "SOU-400";
  src:url('./assets/fonts/SamsungOneUI-400 V3.0.ttf');
}
@font-face {
  font-family: "SOU-500";
  src:url('./assets/fonts/SamsungOneUI-500 V3.0.ttf');
}
@font-face {
  font-family: "SOU-600";
  src:url('./assets/fonts/SamsungOneUI-600 V3.0.ttf');
}
@font-face {
  font-family: "SOU-700";
  src:url('./assets/fonts/SamsungOneUI-700 V3.0.ttf');
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.slide-leave-active,
.slide-enter-active {
  transition: all 300ms ease-out;
  opaticy: 0;
}
.slide-enter {
  transform: translate(100%, 0);
}
.slide-leave-to {
  transform: translate(-100%, 0);
}
.startBtn {
    position: absolute;
    left: 0;
    top: 0;
    width: 50%;
    height: 50%;
    font-size: 100px;
}
/* .shadow {
  position: absolute;
  left: 0;
  top: -33px;
  width: 100%;
  height: 30px;
  box-shadow: 0px 0px 5px 60px rgba(0,0,0,0.3);

}
.bm {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  box-shadow: 0 0 0 30px rgba(0,0,0,1) inset;
} */
</style>
