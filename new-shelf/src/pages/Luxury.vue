<template>
    <div class="luxury" v-on:click="togglePleats">
        <Pleats ref="pleats"
            dir="luxury"
            v-bind:widgets="widgets"
            v-bind:show="openPleats"
            v-bind:color="color">
        </Pleats>
    </div>
</template>
<script>
import Pleats from '../components/Pleats.vue'
import * as WidgetsData from '../assets/luxuryWidgets.json'

var getMobile;

export default {
    name: 'Luxury',
    components: {
        Pleats
    },
    props: {
        color: {
            type: String,
            default: "navy"
        }
    },
    data() {
        return {
            widgets: WidgetsData.widgets,
            openPleats: false,
            showImageBoard: false,
            blackBoardClass: 'blackBoard',
        }
    },
    watch: {
        showBlackBoard: function(newVal) {
            if (newVal) {
                this.blackBoardClass = 'blackBoard blackBoardIn';
            } else {
                this.blackBoardClass = 'blackBoard blackBoardOut';
            }
        }
    },
    methods: {
        togglePleats: function() {
            this.openPleats = !this.openPleats;
        },
        getMobile(data) {
            console.log(data);
            if (data.value == 'blackBoard') {
                this.showBlackBoard = !this.showBlackBoard;
            } else if (data.value == 'account') {
                this.$router.push({ name: 'account', params: {id: 2, bgColor: this.color}});
            }
        }
    },
    mounted() {
        getMobile = this.getMobile.bind(this);
        this.$socket.on('appMsg', getMobile);
    },
    destroyed() {
        this.$socket.off('appMsg', getMobile);
    },
}
</script>
<style>
.luxury {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
