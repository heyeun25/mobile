<template>
    <div class="familyContainer" v-on:click="togglePleats">
        <Pleats ref="pleats"
            dir="family"
            v-bind:widgets="widgets"
            v-bind:show="openPleats"
            v-bind:color="color"
            blackBoard="true"
            v-bind:showBlackBoard="showBlackBoard">
        </Pleats>
    </div>
</template>
<script>
import Pleats from '../components/Pleats.vue'
import * as WidgetsData from '../assets/familyWidgets.json'

var getMobile, showTimer, hideTimer = null;

export default {
    name: 'Family',
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
            showBlackBoard: false,
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
                this.$refs.pleats.addWidget();
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
</style>
