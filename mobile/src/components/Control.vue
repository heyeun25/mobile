<template>
  <div class="container">
    <ol v-for="(value, index) in info" v-bind:key="index" class="category">
      {{value.category}}
      <div class="btnContainer">
        <div v-for="(item, index) in value.list"
             v-bind:key="index" class="btn"
             v-on:click="send(item.data)">
          {{item.name}}
        </div>
        <input type="color" v-if="value.category == 'picker'" @change="colorChange($event)"/>
      </div>
    </ol>
    
  </div>
</template>

<script>
import io from 'socket.io-client'
var socket = io('http://localhost:8080')
socket.on('connect', function() {
  console.log('socket');
})

export default {
  name: 'Control',
  props: {
    msg: String
  },
  data: function() {
    return {
      // func : router name of client
      // value : func page will get value by props
      info : [
        {
            category: "image",
            list: [{ name: "image0", data: { func: 'image', value: "Beige_BG-01.png"}},
                  { name: "image1", data: { func: 'image', value: "navy_BG-01.jpg" }}],
        },
        {
            category: "video",
            list: [{ name: "video0", data: { func: 'video', value: "video0.mp4"}}],
        },
        {
            category: "picker",
        },
        {
            category: "fractal",
            list: [
                    { name: "play/pause", data: { func: 'home', value: {pp : 'pp'}}},
                    { name: "restart", data: {func: 'home', value: {restart: 'restart'}}},
                    { name: 'pleatsOpen', data: {func: 'home', value: {pleats: 'pleats'}}}
                  ]
        },
      ],
    }
  },
  methods: {
    colorChange: function(e) {
      console.log(e.target.value);
      socket.emit('appMsg', { func: "home", value: {color: e.target.value}})
    },
    send: function(data) {
      console.log(JSON.stringify(data));
      socket.emit('appMsg', data);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.category {
  display: flex;
  flex-direction: column;
}
.btnContainer {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  height: 100px;
}
.btn {
  width: 100px;
  height: 100px;
  background-color: darkgreen;
  text-align: center;
  line-height: 100px;
  color: white;
  outline: 1px solid white;
}
input {
  position: absolute;
  width: 100px;
  height: 100px;
}
</style>
