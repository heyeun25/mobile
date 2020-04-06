<template>
    <div class="home" ref="home" v-on:click="togglePleats">
        <Pleats ref="pleats"
            dir="greenery"
            v-bind:widgets="widgets"
            v-bind:show="openPleats"
            v-bind:color="pleatsColor"></Pleats>
        <Tree ref="tree" 
            v-if="plantMode == 0"
            v-bind:playpause="playpause"></Tree>
        <CircleTree ref="circle" 
            v-if="plantMode == 1"></CircleTree>
        <Character ref="character"
            v-bind:imgInfo="characterItem"
            v-if="plantMode >= 2"></Character>
        <Info ref="info"
            dir="greenery"
            v-bind:show="openPleats"
            v-bind:widgets="widgets"></Info>
        <transition name="slide-up">
            <Thumbnail v-if="thumbnail" ref="thumbnail"
            v-bind:items="thumbItems"
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
import * as widgetData from '../assets/greeneryWidgets.json'
import { setTimeout, clearTimeout } from 'timers';
import Info from "../components/Info";


const PLANT = {
    TREE: 0,
    CIRCLE: 1,
    PATTERN_K: 2,
    PATTERN_S: 3,
    PATTERN_C: 4,
    PATTERN_P: 5,
    PATTERN_M: 6,
};
var getMobile, showTimer, hideTimer;


const characterItems = [
    {img: 'kaws.png', w: 222, h: 172, cnt: 30, scale: 800},
    {img: 'fractal_square.png', w: 816, h: 857, cnt: 30, scale: 550},
    {img: 'fractal_circle.png', w: 251, h: 251, cnt: 30, scale: 150},
    {img: 'pengsu.png', w: 442, h: 906, cnt: 30, scale: 800},
    {img: 'dog.png', w: 930, h: 985, cnt: 45, scale: 250}
]

export default {
    name: 'Greenery',
    components: {
        Tree,
        Pleats,
        CircleTree,
        Thumbnail,
        Character,
        Info
    },
    data() {
        return {
            openPleats: false,
            pleatsColor: "#101012",
            playpause: false,
            plantMode: PLANT.TREE,
            thumbnail: false,
            thumbItems: [
                {title: 'Bushes', img: '01.png'},
                {title: 'Vines', img: '02.png'},
                {title: 'Kaws', img: '03.png'},
                {title: 'Square', img: '04.png'},
                {title: 'Circle', img: '05.png'},
                {title: 'Pengsu', img: '06.png'},
                {title: 'Make your own', img: '07.png'}],
            // characterSize: imageData[0],
            // characterImage: 'kaws.png',
            characterItem: characterItems[0],
            widgets: widgetData.widgets
            // widgetData: widgetData.widgets,
        }
    },
    mounted() {
        this.$refs.home.focus();
        getMobile = this.getMobile.bind(this);
        this.$socket.on('appMsg', getMobile);
        if (showTimer) {
            clearTimeout(showTimer);
            showTimer = null;
        }
        var that = this;
        showTimer = setTimeout(() => {
            that.togglePleats();
        }, 500);
    },
    methods: {
        changeTheme: function(theme) {
            console.log('changeTheme', theme);
            this.plantMode = theme;
            if (this.plantMode >= PLANT.PATTERN_K) {
                var idx = this.plantMode-PLANT.PATTERN_K;
                this.characterItem = characterItems[idx];
            }
            this.thumbnail = false;
        },
        togglePleats: function() {
            this.openPleats = !this.openPleats;
        },
        getMobile: function(data) {
            console.log('getMobile', data);
            if (data.value.color) this.pleatsColor = data.value.color;
            else if (data.value.pp) this.playpause = !this.playpause;
            else if (data.value.restart) this.$refs.tree.restart();
            else if (data.value.pleats) this.togglePleats();
            else if (data.value.theme) this.plantMode = parseInt(data.value.theme);
            else if (data.value == 'thumbnail') this.thumbnail = !this.thumbnail;
            else if (data.value == 'account') {
                // dim and moveTo account
                var myRouter = this.$router;
                this.togglePleats();
                if (this.$refs.character) {
                    this.$refs.character.dim(function() {
                        myRouter.push({name: 'account',
                            params: {id : 1, bgColor: this.pleatsColor}});
                    });
                } else {
                    if (hideTimer) {
                        clearTimeout(hideTimer);
                        hideTimer = null;
                    }
                    hideTimer = setTimeout(() => {
                        myRouter.push({name: 'account',
                        params: {id : 1, bgColor: this.pleatsColor}});
                    }, 500);
                }
            } else if (data.value.key) {
                this.thumbnail ? this.$refs.thumbnail.handleKey(data.value.key): null
            }
        }
    },
    destroyed() {
        if (showTimer) {
            clearTimeout(showTimer);
            showTimer = null;
        }
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }
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

