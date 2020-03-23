<template>
  <div class="container" ref="container">
    
    <input type="color" @change="colorChange($event)"/>
    <button v-on:click="togglePicker">{{'picker = ' + colorPicker}}</button>
    <div v-for="(value, index) in info" v-bind:key="index" class="category">
      <span>{{value.category}}</span>
      <div class="btnContainer">
        <div v-for="(item, index) in value.list"
             v-bind:key="index" class="btn"
             v-on:click="send(item.data)">
          {{item.name}}
          
        </div>
      </div>
    </div>
    <video
      v-bind:class="(orient == 0 ? 'vertical' : 'horizontal')"
      ref="myVideo"
      controls
      muted
      src="../assets/phoneCall.mp4"></video>
  </div>
</template>

<script>
import io from 'socket.io-client'
var socket = io('http://localhost:8080')
socket.on('connect', function() {
  console.log('socket');
})
var handle;
export default {
  name: 'Control',
  props: {
    msg: String
  },
  data: function() {
    return {
      colorPicker: 'pleatsBg',
      orient: 0,
      // func : router name of shelf front app
      // category : category on mobile app
      // name : button name on mobile app
      // value : func page will get value as props
      info : [
        // {
        //     category: "image",
        //     list: [{name: "Health", data: { func: 'image', value: "Energetic-01.jpg"}},
        //           {name: "Family", data: { func: 'image', value: "Family-01.jpg" }},+
        //           {name: "Fandom", data: { func: 'image', value: "Fandom-01.jpg" }},
        //           {name: "Green", data: { func: 'image', value: "Green-01.jpg" }},
        //           {name: "Kidult", data: { func: 'image', value: "Kidult.jpg" }}],
        // },
        
        {
            category: "Scenario",
            list: [{name: "Greenery", data: { func: 'greenery', value: { theme: '0'}}},
                   {name: "Thumbnail", data: {func: 'greenery', value: 'thumbnail'}},
                   {name: "Diana Account", data: { func: 'greenery', value: 'account'}},
                   {name: "change Account", data: { func: 'account', value: 'change'}},
                   {name: "Edit Board", data: { func: 'health', value: 'addBoard'}},
                   {name: "Phone Call", data: { func: 'health', value: { phoneCall : 'vertical'}}},
                   ]
        },
        {
            category: "fractal",
            list: [
                    {name: "play/pause", data: { func: 'greenery', value: {pp : 'pp'}}},
                    {name: "restart", data: {func: 'greenery', value: {restart: 'restart'}}},
                    {name: "left", data: {func: 'greenery', value: {key: 'left'}}},
                    {name: "right", data: {func: 'greenery', value: {key: 'right'}}},
                    {name: "enter", data: {func: 'greenery', value: {key: 'enter'}}}
                  ]
        },
        {
            category: "video",
            list: [{name: "video0", data: { func: 'video', value: "video0.mp4"}}],
        },
      ],
      
    }
  },
  methods: {
    togglePicker: function() {
      this.colorPicker = (this.colorPicker == 'pleatsBg' ?
                          'pleatsItem' : 'pleatsBg');
    },
    colorChange: function(e) {
      console.log(e.target.value);
      socket.emit('appMsg', {
                  func: this.colorPicker == 'pleatsBg' ? 'greenery' : 'health',
                  value: {target: this.colorPicker, color: e.target.value}})
    },
    send: function(data) {
      console.log(JSON.stringify(data));
      if (data.value.phoneCall && data.value.phoneCall == 'vertical') {
        this.$refs.myVideo.style.visibility = "inherit";
        // this.$refs.myVideo.requestFullscreen();
        this.$refs.myVideo.play();
        // return;
      }
      socket.emit('appMsg', data);
    },
    handleOrientation: function() {
      this.orient = JSON.stringify(window.orientation);
      console.log('orientation change');
      if (this.orient == 90) {
        this.send({ func: 'health', value: { phoneCall : 'horizontal'}}); // toggle
      } else if (this.orient == 0){
        this.send({ func: 'health', value: { phoneCall : 'vertical'}}); // toggle
      }
      // alert('aa');
    },
    onPlay: function() {
      // socket.emit('appMsg', { func: 'health', value: 'call'});
    },
    onPause: function() { 
      // console.log('pause')
      this.$refs.myVideo.currentTime = 0;
      this.$refs.myVideo.style.visibility = "hidden";
      this.send({ func: 'health', value : {phoneCall : 'finish'}})
      // this.$refs.myVideo.exitFullscreen();
      // alert('aa');
    }
  },
  mounted() {
    handle = this.handleOrientation.bind(this);
    window.addEventListener("orientationchange", handle);
    // window.addEventListener("deviceorientation", () => {
    //   alert('device orientation');
    // })
    this.$refs.container.requestFullscreen();
    this.$refs.myVideo.onpause = this.onPause;
    this.$refs.myVideo.onplay = this.onPlay;
  },
  destroyed() {
    window.removeEventListener("orientationchange", handle)
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
  flex-direction: column;
}
.btn {
  background-color: darkgreen;
  text-align: center;
  line-height: 60px;
  color: white;
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
  height: 100%;
}

.horizontal {
  width: 100%;
}


</style>
