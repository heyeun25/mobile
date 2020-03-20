<template>
  <div id="app">
    <router-view></router-view>
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
</style>
