<template>
  <div class="container">
    <div v-for="(value, index) in info" v-bind:key="index" class="category">
      <span>{{value.category}}</span>
      <div class="btnContainer">
        <div v-for="(item, index) in value.list"
             v-bind:key="index" class="btn"
             v-on:click="send(item.data)">
          {{item.name}}
          <input type="color" v-if="value.category == 'picker'" @change="colorChange($event)"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'
var getMobile;
var socket = io(location.protocol + '//' + location.hostname + ':8080')
socket.on('connect', function() {
  socket.emit('identify', 'control');
});
export default {
  name: 'Control',
  props: {
    msg: String
  },
  data: function() {
    return {
      colorPicker: 'pleatsBg',
      phoneCall: false,
      orient: 0,
      videoStatus: 0,
      showImage: '',
      // func : router name of shelf front app
      // category : category on mobile app
      // name : button name on mobile app
      // value : func page will get value as props
      info : [{
              category: "displayShelf",
              list: [
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
                ]
            }, {
              category: "picker",
              list: [{name: "changeAppColor", data: {func: 'appColor', value: 'red'}}],
            }
        ],
      
    }
  },
  methods: {
    colorChange: function(e) {
      console.log(e.target.value);
      socket.emit('appMsg', {func: 'appColor', value: e.target.value})
    },
    send: function(data) {
      console.log(JSON.stringify(data));
      if (data.func == 'mobile') {
        socket.emit('controller', data);
        return;
      }
      socket.emit('appMsg', data);
      
    },
  },
  mounted() {
  },
  destroyed() {
    socket.off('appMsg', getMobile);
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
.category {
  /* display: flex; */
  flex-direction: column;
}
.btnContainer {
  display: flex;
  flex-wrap: wrap;
}
.btn {
  background-color: beige;
  text-align: center;
  width: 100px;
  height: 60px;
  line-height: 60px;
  color: black;
  outline: 1px solid white;
}
input {
  position: absolute;
  width: 100px;
  height: 50px;
  right: 0px;
}
video {
  position: fixed;
  top: 0;
  left: 0;
  visibility: hidden;
}

.vertical {
  top: -5%;
  width: 100%;
}

.vertical2 {
  top: -15%;
  width: 100%;
}

.horizontal {
  width: 100%;
}

.fullSize {
  position: absolute;
  right: 0;
  width: 100%;
  height: 30px;
  /* color: white; */
  background-color: transparent;
  border: 0px transparent solid;
  font-size: 30px;
}

.mobileImage {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
