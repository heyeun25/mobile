<template>
  <div id="app">
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {
  },
  mounted: function() {
    const socket = this.$socket;
    this.$socket.on('connect', function() {
      socket.emit('identify', 'shelf');
    });

    const myRouter = this.$router;
    this.$socket.on('appMsg', function(d) {
      console.log(d);
      // console.log(myRouter.currentRoute);
      if (myRouter.currentRoute.name !== d.func) {
        myRouter.push({name: d.func, params: d.value})
      }
    });
  }
}
</script>

<style>
body, html {
  left: 0;
  top: 0;
  margin: 0;
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
</style>
