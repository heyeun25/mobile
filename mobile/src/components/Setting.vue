<template>
    <div class="style-setting">
        <img id="setting-tab"
            v-bind:src="require('../assets/setting/1_Upper Tab.png')"
            v-on:click="goBack"/>
        <img id="setting-title" v-bind:src="require('../assets/setting/2_Screen Settings_Title.png')" />
        <div class="color-chart">
            <div v-for="(item, index) in bgColors" class="color-item" v-bind:key="index"></div>
        </div>
        <div class="color bg-color">
            <div class="color-control">
                <span>Brightness</span>
                <input ref="bgRed" type="range" min="0" max="100"
                    value="50" class="slider" id="slide01" @change="onChangeBg">
            </div>
            <div class="color-control">
                <span>Saturation</span>
                <input ref="bgGreen" type="range" min="0" max="100"
                    value="50" class="slider" id="slide02" @change="onChangeBg">
            </div>
            <div class="color-control">
                <span>Color tone</span>
                <input ref="bgBlue" type="range" min="0" max="360"
                    value="50" class="slider" id="slide03" @change="onChangeBg">
            </div>
        </div>
        <img id="shelf-title" v-bind:src="require('../assets/setting/3_Shelf Settings.png')"/>
        <div class="color-chart">
            <div v-for="(item, index) in bgColors" class="color-item" v-bind:key="index"></div>
        </div>
        <div class="color shelf-color">
            <div class="color-control">
                Brightness
                <input ref="shelfRed" type="range" min="0" max="100"
                    value="50" class="slider" id="slide01" @change="onChangeShelf">
            </div>
            <div class="color-control">
                Saturation
                <input ref="shelfGreen" type="range" min="0" max="100"
                    value="50" class="slider" id="slide02" @change="onChangeShelf">
            </div>
            <div class="color-control">
                Color tone
                <input ref="shelfBlue" type="range" min="0" max="360"
                    value="50" class="slider" id="slide03" @change="onChangeShelf">
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            bgColors : [
                'red',
                'white',
                'green',
                'blue',
                'black'
            ]
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        onChangeBg(event) {
            event.preventDefault();
            const l = this.$refs.bgRed.value;
            const s = this.$refs.bgGreen.value;
            const h = this.$refs.bgBlue.value;
            this.$socket.emit('appMsg', {func: 'appColor', value: `hsl(${h}, ${s}%, ${l}%)`});
        },
        onChangeShelf(event) {
            event.preventDefault();
            const l = this.$refs.shelfRed.value;
            const s = this.$refs.shelfGreen.value;
            const h = this.$refs.shelfBlue.value;
            this.$socket.emit('appMsg', {func: 'appColor', value: `hsl(${h}, ${s}%, ${l}%)`});
        }
    },
    mounted() {
        
    },
}
</script>
<style>
.style-setting {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: #EEEEEE;
}
.color-chart {
    display: flex;
    justify-content: center;
    margin: 0 30px;
}

.color-item {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 15px 5px;
    background-color: #ffcc00;
}

.bg-color {
    margin: 0 30px;
}

.color-control {
    margin: 10px 0px;
}

.shelf-color {
    margin: 0 30px;
}

#setting-tab {
    width: 360px;
    height: 58px;
}

#setting-title {
    width: 299px;
    height: 57px;
    margin: 10px 30px;
}

#shelf-title {
    width: 299px;
    height: 22px;
    margin: 10px 30px;
}

.style-setting > .color {
    display: flex;
    flex-direction: column;
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 3px;
  border-radius: 5px;  
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
  margin: 10px 0px;
}

#slide01 {
  background: linear-gradient(to right,black, white);
}

#slide02 {
    background: linear-gradient(to right, gray, #FFCC99);
}

#slide03 {
    background: linear-gradient(to right, #009999, #FFCC00);
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%; 
  background: white;
  box-shadow:  -1px 3px 12px 0px rgba(168,168,168,1);
  cursor: pointer;
}

</style>
