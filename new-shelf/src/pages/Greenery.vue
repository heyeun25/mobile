<template>
    <div class="home" ref="home" v-on:click="tooglePleats">
        <button>hello</button>
        <Pleats ref="pleats"
            v-bind:show="openPleats"
            v-bind:color="pleatsColor"></Pleats>
        <Tree ref="tree" 
            v-if="plantMode == 0"
            v-bind:playpause="playpause"></Tree>
        <CircleTree ref="circle" 
            v-if="plantMode == 1"></CircleTree>
        <Character ref="pattern"
            v-if="plantMode >= 2"
            v-bind:imgSrc="characterImage"
            v-bind:imgSize="characterSize"></Character>
        <span class="name">Hi, Joanah!</span>
        <span class="message">Your plants ready for watering today.</span>
        <span class="musicTitle">▶ Chocolate legs - Eric Bernet</span>
        <transition name="slide-up">
            <Thumbnail v-if="thumbnail" ref="thumbnail"
            v-bind:items="items"
            v-bind:change-theme="changeTheme"></Thumbnail>
        </transition>
    </div>
</template>
<script>
import Pleats from '../components/Pleats.vue'
import Tree from '../components/Tree.vue'
import CircleTree from '../components/CircleTree.vue'
import Thumbnail from '../components/Thumbnail.vue'
import Character from '../components/Character.vue'
const imageData = [
    {w: 222, h: 172},
    {w: 442, h: 906},
    {w: 910, h: 1073}
]
const PLANT = {
    TREE: 0,
    CIRCLE: 1,
    PATTERN_K: 2,
    PATTERN_D: 3,
    PATTERN_P: 4,
};
var getMobile;
export default {
    name: 'Greenery',
    components: {
        Tree,
        Pleats,
        CircleTree,
        Thumbnail,
        Character
    },
    data() {
        return {
            openPleats: false,
            pleatsColor: "navy",
            playpause: false,
            plantMode: PLANT.TREE,
            thumbnail: false,
            items: [
                'green_2.jpg',
                'kaws.png',
                'pengsu.png',
                'donald.png'],
            characterSize: imageData[0],
            characterImage: 'kaws.png',
        }
    },
    mounted() {
        this.$refs.home.focus();
        getMobile = this.getMobile.bind(this);
        this.$socket.on('appMsg', getMobile);
    },
    methods: {
        changeTheme: function(theme) {
            console.log('changeTheme', theme+1);
            this.plantMode = theme+1;
            if (this.plantMode >= PLANT.PATTERN_K) {
                this.characterSize = imageData[this.plantMode-PLANT.PATTERN_K];
                this.characterImage = this.items[this.plantMode-1];
            }
            this.thumbnail = false;
        },
        tooglePleats: function() {
            this.openPleats = !this.openPleats;
            if (this.openPleats) {
                this.$refs.tree.erase();
            } else {
                this.$refs.tree.restart();
            }
        },
        getMobile: function(data) {
            console.log('getMobile', data);
            if (data.value.color) this.pleatsColor = data.value.color;
            else if (data.value.pp) this.playpause = !this.playpause;
            else if (data.value.restart) this.$refs.tree.restart();
            else if (data.value.pleats) this.tooglePleats();
            else if (data.value.theme) this.plantMode = parseInt(data.value.theme);
            else if (data.value == 'thumbnail') this.thumbnail = !this.thumbnail;
            else if (data.value.key) {
                this.thumbnail ? this.$refs.thumbnail.handleKey(data.value.key): null
            }
        }
    },
    destroyed() {
        this.$socket.off('appMsg', getMobile);
    },
}
</script>
<style>
.home {
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.slide-up { transition: all 0.25s; } 
.slide-up-enter-active { transition: all 0.25s ease; } 
.slide-up-leave-active { transition: all 0.25s cubic-bezier(1, 0.5, 0.8, 1); } 
.slide-up-enter,
.slide-up-leave-active { opacity: 0; transform: translateY(100%); }
.name {
    position: absolute;
    top: 150px;
    left: 150px;
    font-size: 130px;
    font-family: 'SamsungSharpSans';
    color: white;
}

.message {
    position: absolute;
    top: 320px;
    left: 150px;
    font-size: 50px;
    font-family: 'SamsungSharpSans';
    color: white; 
}

.musicTitle {
    position: absolute;
    bottom: 150px;
    left: 150px;
    font-size: 41px;
    font-family: 'SamsungSharpSans';
    color: white;
}
</style>

