<template>
    <div class="container" ref="home" v-on:click="tooglePleats">
        <Pleats v-bind:show="openPleats" v-bind:color="pleatsColor"></Pleats>
        <Tree ref="tree" v-bind:playpause="playpause"></Tree>
    </div>
</template>
<script>
import Pleats from './Pleats.vue'
import Tree from './Tree.vue'

export default {
    name: 'home',
    components: {
        Tree,
        Pleats
    },
    data() {
        return {
            openPleats: false,
            pleatsColor: "#010317",
            playpause: false,
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
            if (data.value.color) this.pleatsColor = data.value.color;
            if (data.value.pp) this.playpause = !this.playpause;
            if (data.value.restart) this.$refs.tree.restart();
            if (data.value.pleats) {
                this.togglePleats();
            }
        }
    },
    destroyed() {
        this.$socket.off('appMsg', this.getMobile);
    },
}
</script>
<style>

</style>

