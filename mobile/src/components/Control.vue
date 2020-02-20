<template>
  <div class="container">
    <ol v-for="(value, index) in info" v-bind:key="index" class="category">
      {{value.category}}
      <div class="btnContainer">
        <div v-for="(item, index) in value.list"
             v-bind:key="index" class="btn"
             v-on:click="send(item.func)">
          {{item.func}}
        </div>
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
      info : [
        {
            category: "image",
            list: [{ func: "image0" },
                  { func: "image1" }],
        },
        {
            category: "video",
            list: [],
        }
      ]
    }
  },
  methods: {
    send: function(value) {
      console.log(value);
      socket.emit('appMsg', value);
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
}
.btn {
  width: 100px;
  height: 100px;
  background-color: darkgreen;
  text-align: center;
  line-height: 100px;
  color: white;
}
</style>
