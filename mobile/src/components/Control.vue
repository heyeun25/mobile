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
      // func : router name of shelf front app
      // category : category on mobile app
      // name : button name on mobile app
      // value : func page will get value as props
      info : [
        // {
        //     category: "image",
        //     list: [{name: "Health", data: { func: 'image', value: "Energetic-01.jpg"}},
        //           {name: "Family", data: { func: 'image', value: "Family-01.jpg" }},
        //           {name: "Fandom", data: { func: 'image', value: "Fandom-01.jpg" }},
        //           {name: "Green", data: { func: 'image', value: "Green-01.jpg" }},
        //           {name: "Kidult", data: { func: 'image', value: "Kidult.jpg" }}],
        // },
        {
            category: "video",
            list: [{name: "video0", data: { func: 'video', value: "video0.mp4"}}],
        },
        {
            category: "Scenario",
            list: [{name: "Green Life1", data: { func: 'greenery', value: { theme: '0'}}},
                   {name: "thumbnail", data: {func: 'greenery', value: 'thumbnail'}},
                   {name: "Green Life2", data: { func: 'greenery', value: { theme: '1'}}},
                   {name: "Go Health", data: { func: 'health', value: {}}},
                   {name: "Edit Board", data: { func: 'health', value: 'addBoard'}},
                   {name: "Phone Call", data: { func: 'health', value: 'call'}},
                   {name: "Wide", data: { func: 'health', value: 'wide'}}
                   ]
        },
        {
            category: "picker",
            list: [{name: "picker"}],
        },
        {
            category: "fractal",
            list: [
                    {name: "play/pause", data: { func: 'greenery', value: {pp : 'pp'}}},
                    {name: "restart", data: {func: 'greenery', value: {restart: 'restart'}}},
                    // {name: 'pleatsOpen', data: {func: 'home', value: {pleats: 'pleats'}}}
                    
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
  flex-direction: row;
}
.btn {
  background-color: darkgreen;
  text-align: center;
  line-height: 100px;
  width: 100px;
  color: white;
  outline: 1px solid white;
}
input {
  position: absolute;
  width: 100px;
  height: 100px;
}
</style>
