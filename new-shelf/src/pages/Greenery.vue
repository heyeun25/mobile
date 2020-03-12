<template>
    <div class="home" ref="home" v-on:click="tooglePleats">
        <Pleats 
            ref="pleats"
            v-bind:show="openPleats" v-bind:color="pleatsColor"></Pleats>
        <Tree ref="tree" 
            v-if="plantMode == 0"
            v-bind:playpause="playpause"></Tree>
        <CircleTree ref="circle" 
            v-if="plantMode == 1"></CircleTree>
        <transition name="slide-up">
            <Thumbnail v-if="thumbnail"></Thumbnail>
        </transition>
    </div>
</template>
<script>
import Pleats from '../components/Pleats.vue'
import Tree from '../components/Tree.vue'
import CircleTree from '../components/CircleTree.vue'
import Thumbnail from '../components/Thumbnail.vue'

const PLANT = {
    TREE: 0,
    CIRCLE: 1
}
export default {
    name: 'Greenery',
    components: {
        Tree,
        Pleats,
        CircleTree,
        Thumbnail
    },
    data() {
        return {
            openPleats: false,
            pleatsColor: "navy",
            playpause: false,
            plantMode: PLANT.TREE,
            thumbnail: false,
        }
    },
    mounted() {
        this.$refs.home.focus();
        this.$socket.on('appMsg', this.getMobile);
    },
    methods: {
        tooglePleats: function() {
            this.openPleats = !this.openPleats;
            if (this.openPleats) {
                this.$refs.tree.erase();
            } else {
                this.$refs.tree.restart();
            }
        },
        getMobile: function(data) {
            console.log('getMobile');
            if (data.value.color) this.pleatsColor = data.value.color;
            if (data.value.pp) this.playpause = !this.playpause;
            if (data.value.restart) this.$refs.tree.restart();
            if (data.value.pleats) {
                this.tooglePleats();
            }
            if (data.value.theme) {
                this.plantMode = parseInt(data.value.theme);
                console.log('plantMode', this.plantMode);
            }
            if (data.value == 'thumbnail') {
                this.thumbnail = !this.thumbnail;
            }
        }
    },
    destroyed() {
        this.$socket.off('appMsg', this.getMobile.bind(this));
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
</style>

