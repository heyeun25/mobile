<template>
    <div class="displayShelf">
        <Skin v-bind:skinIdx="skinIdx"></Skin>
        <Plate id="plate-01" v-bind:lineWidth=1320
            v-bind:color="shelfColor">
            <Info v-bind:clockIdx="clockIdx"></Info>
        </Plate>
        <Plate id="plate-02" v-bind:lineWidth=916
            v-bind:contentHeight=1376
            v-bind:color="shelfColor">
            <ShelfPhoto
            id="photo1"
            class="shelf-photo"
            v-bind:src="photoSet[photoIdx][0]"></ShelfPhoto>
        </Plate>
        <Plate id="plate-03" v-bind:lineWidth=612
            v-bind:contentHeight=815
            v-bind:color="shelfColor">
            <ShelfPhoto
                id="photo2"
                class="shelf-photo"
                v-bind:src="photoSet[photoIdx][1]"></ShelfPhoto>
        </Plate>
        <Plate id="plate-04" v-bind:lineWidth=689
            v-bind:contentHeight=448
            v-bind:color="shelfColor">
            <ShelfPhoto
            id="photo3"
            class="shelf-photo"
            v-bind:src="photoSet[photoIdx][2]"></ShelfPhoto>
        </Plate>
    </div>
</template>
<script>
import Plate from '@/components/Plate.vue'
import Info from '@/components/Info.vue'
import ShelfPhoto from '@/components/ShelfPhoto.vue'
import Skin from '@/views/Skin.vue'

var getMobile;
const VIDEO_STATUS = {
    NONE : 0,
    VERTICAL : 1,
    VERTICAL2 : 2,
    HORIZONTAL : 3,
};

export default {
    name: 'displayShelf',
    components: {
        // Video,
        Skin,
        Plate,
        Info,
        ShelfPhoto
    },
    data() {
        return {
            videoStatus : VIDEO_STATUS.NONE,
            horizontalVideoClass: 'hotizontalHide horizontalVideo',
            verticalVideoClass: 'hide verticalVideo',
            verticalVideo2Class: 'hide verticalVideo2',
            skinIdx: -1,
            clockIdx: 0,
            shelfColor: 'white',
            photoIdx: 0,
            photoSet: [[require('@/assets/photo1_01.jpg'),
                require('@/assets/photo2_01.png'),
                require('@/assets/photo3_01.gif')],
                [require('@/assets/photo1_01.jpg'),
                require('@/assets/photo2_01.png'),
                require('@/assets/photo3_01.gif')]]
        }
    },
    watch: {
        videoStatus: function(val) {
            console.log('val=', val);
            switch(val) {
                case VIDEO_STATUS.NONE:
                    this.verticalVideoClass = 'hide verticalVideo';
                    this.verticalVideo2Class = 'hide verticalVideo2';
                    this.horizontalVideoClass = "horizontalVideo hotizontalHide";
                    this.stopWidgetVideo = false;
                    this.$refs.verticalVideo.currentTime = 0;
                    this.$refs.verticalVideo.pause();
                    this.$refs.verticalVideo2.currentTime = 0;
                    this.$refs.verticalVideo2.pause();
                    this.$refs.horizontalVideo.currentTime = 0;
                    this.$refs.horizontalVideo.pause();
                break;
                case VIDEO_STATUS.VERTICAL:
                    this.verticalVideoClass = 'verticalVideo verticalShow';
                    this.verticalVideo2Class = 'hide verticalVideo2';
                    this.horizontalVideoClass = "horizontalVideo hotizontalHide";
                    this.stopWidgetVideo = true;
                    this.$refs.verticalVideo.currentTime = 0;
                    this.$refs.verticalVideo.play();
                    this.$refs.verticalVideo2.currentTime = 0;
                    this.$refs.verticalVideo2.pause();
                    this.$refs.horizontalVideo.currentTime = 0;
                    this.$refs.horizontalVideo.pause();
                break;
                case VIDEO_STATUS.VERTICAL2:
                    this.verticalVideoClass = 'hide verticalVideo';
                    this.verticalVideo2Class = 'verticalVideo2';
                    this.horizontalVideoClass = 'horizontalVideo hotizontalHide';
                    this.$refs.verticalVideo.currentTime = 0;
                    this.$refs.verticalVideo.pause();
                    this.$refs.verticalVideo2.currentTime = 0;
                    this.$refs.verticalVideo2.play();
                    this.$refs.horizontalVideo.currentTime = 0;
                    this.$refs.horizontalVideo.pause();
                break;
                case VIDEO_STATUS.HORIZONTAL:
                    this.verticalVideoClass = 'hide verticalVideo';
                    this.verticalVideo2Class = 'hide verticalVideo2';
                    this.horizontalVideoClass = "horizontalVideo hotizontalFullScreen";
                    this.$refs.verticalVideo.currentTime = 0;
                    this.$refs.verticalVideo.pause();
                    this.$refs.verticalVideo2.currentTime = 0;
                    this.$refs.verticalVideo2.pause();
                    this.$refs.horizontalVideo.currentTime = 0;
                    this.$refs.horizontalVideo.play();
                // this.$refs.horizontalVideo.currentTime = this.$refs.verticalVideo.currentTime;
                break;
                default:
                break;
            }
        }
    },
    methods: {
        mobile: function(data) {
            console.log('mobile', data);
            var value = data.value;
            if (value.skin) { // change skin
                this.skinIdx = value.index;
            }

            if (value.clock) {
                this.clockIdx = value.clockIdx;
            }

            if (value.photo) {
                this.photoIdx = value.photoIdx;
            }

            if (value.shelfColor) {
                this.shelfColor = value.shelfColor;
            }
        }
    },
    mounted() {
        console.log('mounted');
        getMobile = this.mobile.bind(this);
        this.$socket.on('appMsg', getMobile);
    },
    beforeDestroy() {
        this.$socket.off('appMsg', getMobile);
    },
}
</script>
<style>
.displayShelf {
    width: 100%;
    height: 100%;
}
.verticalVideo {
    position: absolute;
    right: 0px;
    height: 101%;
    transform: translateX(100%);
}

.verticalVideo2 {
    position: absolute;
    right: 0px;
    height: 101%;
}

.horizontalVideo {
    /* outline: 1px solid red; */
    position: absolute;
    top: 0;
    width: 100%;
    left: 100%;
    height: 101%;
    object-fit: fill;
}

.horizontalShow {
    left: 69%;
}

.hotizontalFullScreen {
    animation: 1s toLeft forwards;
}

.hotizontalHide {
    animation: 1s toRight forwards;
}

.verticalShow {
    animation: 1s toVLeft forwards;
}

.verticalHide {
    animation: 1s toVRight forwards;
}

.hide {
    visibility: hidden;
}

.info-plate {
    position: absolute;
}

.shelf-photo {
    position: absolute;
    filter: drop-shadow(0px 8px 8px rgba(0,0,0,.3));
}

#plate-01 {
    top: 1026px;
    left: 318px;
}

#plate-02 {
    top: 357px;
    left: 2785px;
}

#plate-03 {
  left: 1882px;
  top: 1178px;
}

#plate-04 {
  left: 1375px;
  top: 188px;
}

@keyframes toLeft {
    from { left: 67%; }
    to { left: 0; }
}

@keyframes toRight {
    from { left: 0; }
    to { left: 100%; }
}

@keyframes toVLeft {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
}

@keyframes toVRight {
    from { transform: translateX(0); }
    to { transform: translateX(100%); }
}

</style>
