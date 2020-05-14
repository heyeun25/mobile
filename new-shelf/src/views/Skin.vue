<template>
    <div class="skin">
<!--        <img v-bind:class="greenClass" src="@/assets/shelf_BG_green_final.png"/>-->
<!--        <img v-bind:class="paulClass" src="@/assets/shelf_BG_paulsmith.png">-->
        <div v-for="(skin, i) in skinList" class="skinItem" v-bind:class="{'show': i <= skinIdx }" v-bind:key="i">
            <img v-bind:src="skin.img" v-if="skin.img">
            <video v-bind:src="skin.video" v-if="skin.video" autoplay loop muted></video>
        </div>
    </div>
</template>
<script>
var getMobile;
export default {
    components: {
    },
    data() {
        return {
            skinList: [
                {img: require('@/assets/shelf_BG_green_final.png'), bodyClass: 'bg_check'},
                {video: require('@/assets/video/visualizer_1.mp4'), bodyClass: 'bg_paulsmith'},
                {img: require('@/assets/shelf_BG_navy.png'), bodyClass: 'bg_fabric'}
            ],
            skinIdx: -1
        }
    },
    mounted() {
        document.body.className = 'bg_wall';
    },
    methods: {
        getMobile: function(data) {
            var value = data.value;
            if(value.index != undefined) {
                this.skinIdx = value.index;
                if(this.skinIdx == -1) {
                    document.body.className = 'bg_wall';
                }
                if(this.skinList[this.skinIdx] && this.skinList[this.skinIdx].bodyClass) {
                    clearTimeout(this.tmrChangeBG);
                    this.tmrChangeBG = setTimeout((function (className) {
                        return function () {
                            document.body.className = className;
                        };
                    })(this.skinList[this.skinIdx].bodyClass), 600);
                }
            }
        }
    },
    mounted() {
        this.$socket.on('appMsg', this.getMobile);
    }
}
</script>

<style scoped>
.skinItem {
    position: absolute;
    left: 0;
    top: 0;
    transform: translate(3840px, 0);
    transition: transform 500ms ease-out;
}
.skinItem.show {
    transform: translate(0, 0);
}
img {
    position: absolute;
    left: -269px;
    top: -270px;
}

</style>

