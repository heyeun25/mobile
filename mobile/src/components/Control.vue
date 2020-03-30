<template>
  <div class="container" ref="container">
    {{JSON.stringify(this.orient)}}
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
        class="vertical"
        v-if="videoStatus != 2"
        v-bind:style="{visibility: ((orient == 0) && phoneCall && videoStatus == 1? 'visible' : 'hidden')}"
        ref="verticalVideo"
        controls
        muted
        loop
        src="../assets/mobile_sero.mp4"></video>
    <video
      class="vertical2"
      v-bind:style="{visibility: ((orient == 0) && phoneCall && videoStatus == 2 ? 'visible' : 'hidden')}"
      ref="verticalVideo2"
      controls
      muted
      loop
      src="../assets/mobile_sero_02.mp4"></video>
      <video
        class="horizontal"
        v-bind:style="{visibility: ((orient == 90) && phoneCall && videoStatus == 3? 'visible' : 'hidden')}"
        ref="horizontalVideo"
        controls
        muted
        loop
        src="../assets/mobile_garo.mp4"></video>
      <button v-on:click="makeFullScreen" class="fullSize"></button>
      <img v-if="showImage == 'memo'"
          class="mobileImage"
          src="../assets/memo.jpg"
          v-on:click="this.hideImage"/>
      <img v-if="showImage == 'dog'"
          class="mobileImage"
          src="../assets/dog.jpg"
          v-on:click="this.hideImage"/>
  </div>
  
</template>

<script>
import io from 'socket.io-client'
var getMobile;
var socket = io('http://192.168.0.151:8080')
socket.on('connect', function() {
  socket.emit('identify', 'mobile');
});
var handle;
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
      info : [
        {
            category: "Scenario",
            list: [{name: "Greenery", data: { func: 'greenery', value: { theme: '0'}}},
                   {name: "Thumbnail", data: {func: 'greenery', value: 'thumbnail'}},
                   {name: "Phone Call", data: { func: 'health', value: { phoneCall : 'vertical'}}},
                   {name: "Board", data: { func: 'family', value: 'blackBoard'}},
                   {name: "Memo", data: { func: 'family', value: 'addMemo'}},
                   {name: "Pattern", data: { func: 'luxury', value: 'blackBoard'}},
                   ]
        },
        {
          category: "Account",
          list: [
            {name: "Walker", data: { func: 'greenery', value: 'account'}},
            {name: "Dunffy", data: { func: 'health', value: 'account'}},
            {name: "Diana", data: { func: 'family', value: 'account'}},
            {name: "change", data: { func: 'account', value: 'change'}},
          ]
        },
        {
            category: "Greenery",
            list: [
                    {name: "play/pause", data: { func: 'greenery', value: {pp : 'pp'}}},
                    {name: "restart", data: {func: 'greenery', value: {restart: 'restart'}}},
                    {name: "left", data: {func: 'greenery', value: {key: 'left'}}},
                    {name: "right", data: {func: 'greenery', value: {key: 'right'}}},
                    {name: "enter", data: {func: 'greenery', value: {key: 'enter'}}}
                  ]
        },{
          category: "mobile",
          list: [
            {name: "memo", data: {func: 'mobile', value: 'memo'}},
            {name: "dog", data: {func: 'mobile', value: 'dog'}}
          ]
        }
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
      if (data.func == 'mobile') {
        this.showImage = data.value;
        return;
      }
      if (data.value.phoneCall && data.value.phoneCall == 'vertical') {
        this.phoneCall = true;
        this.videoStatus = 1;
        this.$refs.verticalVideo.play();
      }
      socket.emit('appMsg', data);
      
    },
    hideImage: function() {
      this.showImage = '';
    },
    onPause: function() { 
      console.log('pause')
      this.phoneCall = false;
      this.orient = 0;
      this.$refs.verticalVideo2.currentTime = 0;
      this.$refs.verticalVideo.currentTime = 0;
      this.$refs.horizontalVideo.currentTime = 0;
      socket.emit('appMsg', { func: 'health', value: { phoneCall : 'finish'}});
    },
    handle: function() {
      if ((window.orientation == 90 ||
          window.orientation == -90) &&
          this.phoneCall == true) {
        this.orient = 90;
        this.videoStatus = 3;
        this.$refs.verticalVideo2.pause();
        this.$refs.horizontalVideo.play();
        socket.emit('appMsg', { func: 'health', value: { phoneCall : 'horizontal'}});
      }
      if (window.orientation == 0 && this.phonCall == true) {
        this.orient = 0;
        this.$refs.horizontalVideo.currentTime = 0;
      }
    },
    getMobile: function(data) {
      console.log(data);
      if (data.video == 'second') {
        this.videoStatus = 2;
        this.$refs.verticalVideo.pause();
        this.$refs.verticalVideo2.play();
          
      } else if (data.video == 'stop') {
          this.videoStatus = 0;
          this.$refs.horizontalVideo.pause();
          this.onPause();
      }
    },
    makeFullScreen: function() {
      this.$refs.horizontalVideo.requestFullscreen();
    }
  },
  mounted() {
    getMobile = this.getMobile.bind(this);
    socket.on('appMsg', getMobile);
    handle = this.handle.bind(this);
    window.addEventListener("orientationchange", handle);
    this.$refs.horizontalVideo.onpause = this.onPause;
  },
  destroyed() {
    window.removeEventListener("orientationchange", handle);
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
