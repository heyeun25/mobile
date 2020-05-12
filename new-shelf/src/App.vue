<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view></router-view>
    </transition>
    <button class="startBtn" ref="startBtn"
            v-on:click="start">start</button>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {
  },
  watch: {
      '$route' (to, from) {
          if (to.name.indexOf('equalizer') > -1)
            this.transitionName = 'slide';
          else 
            this.transitionName = 'fade';
          console.log('transition', this.transitionName);

      }
  },
  data() {
    return {
      transitionName: 'fade'
    }
  },
  mounted: function() {
    const socket = this.$socket;
    this.$socket.on('connect', function() {
      socket.emit('identify', 'shelf');
    });

    const myRouter = this.$router;
    this.$socket.on('appMsg', function(d) {
      console.log(d);
      if (myRouter.currentRoute.name !== d.func) {
        myRouter.push({name: d.func, params: d.value})
      }
    });
  },
  methods: {
    start: function() {
            console.log('start');
            this.$refs.startBtn.style.visibility = "hidden";
        },
  },
}
</script>

<style>
body, html {
  left: 0;
  top: 0;
  margin: 0;
  background-image: url('./assets/fabric_navy.jpg');
}

#app {
  transform: scale(0.9) translateY(120px);
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

@font-face {
  font-family: 'SamsungSharpSans';
  src: url('./assets/SamsungSans-Light.ttf');
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.slide-leave-active,
.slide-enter-active {
  transition: 1s;
}
.slide-enter {
  transform: translate(100%, 0);
}
.slide-leave-to {
  transform: translate(-100%, 0);
}
.startBtn {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 50%;
    height: 50%;
    font-size: 100px;
}
</style>
