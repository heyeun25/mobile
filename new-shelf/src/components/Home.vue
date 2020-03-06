<template>
    <div class="home" ref="home" v-on:click="tooglePleats">
        <Pleats 
            ref="pleats"
            v-bind:show="openPleats" v-bind:color="pleatsColor"></Pleats>
        <Tree ref="tree" 
            v-if="plantMode == 0"
            v-bind:playpause="playpause"></Tree>
        <Circle ref="circle"
            v-if="plantMode == 1"></Circle>
    </div>
</template>
<script>
import Pleats from './Pleats.vue'
import Tree from './Tree.vue'
import Circle from './CircleTree.vue'
const PLANT = {
    TREE: 0,
    CIRCLE: 1
}
export default {
    name: 'home',
    components: {
        Tree,
        Pleats,
        Circle
    },
    data() {
        return {
            openPleats: false,
            pleatsColor: "navy",
            playpause: false,
            plantMode: PLANT.TREE,
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
            if (data.value == "addBoard") {
                this.$refs.pleats.addBoard();
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
</style>

