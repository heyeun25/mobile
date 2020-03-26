<template>
    <div class="luxury" v-on:click="togglePleats">
        <Pleats ref="pleats"
            dir="luxury"
            v-bind:widgets="widgets"
            v-bind:show="openPleats"
            v-bind:blackBoard="true"
            v-bind:showBlackBoard="showBlackBoard"
            v-bind:color="color">
        </Pleats>
        <img v-bind:class="blackBoardClass"
            v-bind:src="require('../assets/luxury/pattern.jpg')"
            ref="blackBoard" />
        <Info ref="info"
            dir="luxury"
            v-bind:show="openPleats"
            v-bind:stopWidgetVideo="stopWidgetVideo"
            v-bind:widgets="widgets"></Info>
    </div>
</template>
<script>
import Pleats from '../components/Pleats.vue'
import Info from "../components/Info.vue"
import * as WidgetsData from '../assets/luxuryWidgets.json'
import { clearTimeout } from 'timers';

var getMobile;
var showTimer;
export default {
    name: 'Luxury',
    components: {
        Pleats,
        Info
    },
    props: {
        color: {
            type: String,
            default: "#101012"
        }
    },
    data() {
        return {
            widgets: WidgetsData.widgets,
            openPleats: false,
            stopWidgetVideo: false,
            showBlackBoard: false,
            blackBoardClass: 'blackBoard',
        }
    },
    watch: {
        showBlackBoard: function(val) {
            if (val) {
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
        var that = this;
        showTimer = setTimeout(() => {
            that.togglePleats();
        }, 500);
    },
    destroyed() {
        this.$socket.off('appMsg', getMobile);
        clearTimeout(showTimer);
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
.blackBoard {
    position: relative;
    left: 0px;
    top: 0;
    width: 100%;
    height: 100%;
    transform: translateX(100%);
}
.blackBoardIn {
    animation: 1s moveLeft forwards;
}
.blackBoardOut {
    animation: 1s moveRight forwards;
}

@keyframes moveLeft {
    from {
        transform: translateX(100%);
    }
    to {
        transform: translateX(0);
    }
}

@keyframes moveRight {
    from {
        transform: translateX(0%);
    }
    to {
        transform: translateX(100%);
    }
}
</style>
