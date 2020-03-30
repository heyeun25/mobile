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
      v-bind:class="horizontalClass"
      ref="horizontalVideo"
      controls
      muted
      loop
      src="../assets/mobile_garo.mp4"></video>
    <video
      v-bind:class="vertical2Class"
      ref="verticalVideo2"
      controls
      muted
      loop
      src="../assets/mobile_sero_02.mp4"></video>
    <video
      v-bind:class="verticalClass"
      ref="verticalVideo"
      controls
      muted
      loop
      src="../assets/mobile_sero.mp4"></video>
    
  </div>
</template>

<script>
import io from 'socket.io-client'
var getMobile, handle;
var socket = io('http://192.168.0.151:8080')
socket.on('connect', function() {
  socket.emit('identify', 'mobile');
});
const VIDEO_STATUS = {
    NONE : 0,
    VERTICAL : 1,
    VERTICAL2 : 2,
    HORIZONTAL : 3,
};
// var handle;
export default {
  name: 'Control',
  props: {
    msg: String
  },
  data: function() {
    return {
      videoStatus: VIDEO_STATUS.NONE,
      verticalClass: 'vertical hide',
      vertical2Class: 'vertical hide',
      horizontalClass: 'horizontal hide',
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
                  //  {name: "Edit Board", data: { func: 'health', value: 'addBoard'}},
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
        },
        // {
        //     category: "video",
        //     list: [{name: "video0", data: { func: 'video', value: "video0.mp4"}}],
        // },
      ],
      
    }
  },
  watch: {
    videoStatus: function(val){
      switch(val) {
        case VIDEO_STATUS.NONE:
        this.horizontalClass = "horizontal hide";
        this.$refs.horizontalVideo.pause();
        this.init();
        break;
        case VIDEO_STATUS.VERTICAL:
        this.$refs.verticalVideo.play();
        this.verticalClass = 'vertical show';
        break;
        case VIDEO_STATUS.VERTICAL2:
        this.verticalClass = "vertical hide";
        this.vertical2Class = "vertical show"
        this.$refs.verticalVideo.pause();
        this.$refs.verticalVideo2.play();
        break;
        case VIDEO_STATUS.HORIZONTAL:
        this.vertical2Class = "vertical hide";
        this.horizontalClass = "horizontal show";
        break;
      }
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
        this.videoStatus = VIDEO_STATUS.VERTICAL;
      }
      socket.emit('appMsg', data);
    },
    init: function() { 
      console.log('pause')
      this.$refs.verticalVideo2.currentTime = 0;
      this.$refs.verticalVideo.currentTime = 0;
      this.$refs.horizontalVideo.currentTime = 0;
    },
    handle: function() {
      if ((window.orientation == 90 ||
          window.orientation == -90) &&
          this.vieoStatus !== VIDEO_STATUS.NONE) {
        this.orient = 90;
        this.$refs.horizontalVideo.requestFullscreen();
        this.$refs.horizontalVideo.play();
      }
    },
    getMobile: function(data) {
      if (data.video == 'second') {
        this.videoStatus = VIDEO_STATUS.VERTICAL2;
      } else if (data.video == 'horizontal') {
        this.videoStatus = VIDEO_STATUS.HORIZONTAL;
        
      } else if (data.video == 'stop') {
        this.videoStatus = VIDEO_STATUS.NONE;
      }
    }
  },
  mounted() {
    getMobile = this.getMobile.bind(this);
    socket.on('appMsg', getMobile);
    handle = this.handle.bind(this);
    window.addEventListener("orientationchange", handle);
    // this.$refs.horizontalVideo.onpause = this.onPause;
  },
  destroyed() {
    socket.off('appMsg', getMobile);
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
  /* height: 100%; */
  top: -10%;
  width: 100%;
}

.horizontal {
  width: 100%;
}

.hide {
  visibility: hidden;
}

.show {
  visibility: visible;
}


</style>
