<template>
    <div class="familyContainer" v-on:click="togglePleats">
        <Pleats ref="pleats"
            dir="family"
            v-bind:widgets="widgets"
            v-bind:show="openPleats"
            v-bind:color="color"></Pleats>
        <div v-bind:class="blackBoardClass"
            ref="blackBoard"></div>
        <Info ref="info"
            dir="family"
            v-bind:show="openPleats"
            v-bind:widgets="widgets"></Info>
    </div>
</template>
<script>
import Pleats from '../components/Pleats.vue'
import Info from '../components/Info.vue'
import * as WidgetsData from '../assets/familyWidgets.json'

var getMobile, showTimer, hideTimer = null;

export default {
    name: 'Family',
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
                this.togglePleats();
                if (hideTimer) {
                    console.log('clear');
                    clearTimeout(hideTimer);
                    hideTimer = null;
                }
                var myRouter = this.$router;
                hideTimer = setTimeout(() => {
                    myRouter.push({name: 'account',
                    params: {id : 2, bgColor: this.color}});
                }, 500);
            } else if (data.value == 'addMemo') {
                this.$refs.info.addWidget();
            }
        }
    },
    mounted() {
        getMobile = this.getMobile.bind(this);
        this.$socket.on('appMsg', getMobile);
        if (showTimer) clearTimeout(showTimer);
        showTimer = null;
        var that = this;
        showTimer = setTimeout(() => {
            that.togglePleats();
        }, 500);
    },
    destroyed() {
        this.$socket.off('appMsg', getMobile);
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }
        if (showTimer) {
            clearTimeout(showTimer);
            showTimer = null;
        }
    },
}
</script>
<style>
.familyContainer {
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
    background: #383322;
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
