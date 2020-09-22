<template>
    <div class="theme-container">
        <img v-bind:src="bgImgs" />
        <div class='shelf-btn' id="ontv" v-on:click="viewOnTv"></div>
        <div class='shelf-btn' id="style-setting" v-on:click="goStyleSetting"></div>
        <div class='shelf-btn' id="photo" v-on:click="goSelectPhoto"></div>
        <div id="view-detail"></div>
    </div>
</template>
<script>
const imgs = [
    '3_Shelf Theme1_BG.png',
    '3_Shelf Theme1_BG.png',
    '3_Shelf Theme1_BG.png',
    '3_Shelf Theme1_BG.png',
    '3_Shelf Theme1_BG.png',
];
export default {
    computed: {
        bgImgs: function () {
            return require('../assets/main/' + imgs[this.num]);
            // return '../assets/main/' + imgs[0];
        }
    },
    props: {
        num: {
            type: Number,
            default: 0
        }
    },
    name: 'Theme',
    methods: {
        viewOnTv() {
            this.$socket.emit('appMsg', 
                {func: 'displayShelf', 
                     value: 
                     {skin: true,
                      index: this.num-1,
                      clock: true,
                      clockIdx: this.num}});
            
        },
        goStyleSetting() {
            console.log('go style setting');
            this.$router.push({
                name: 'setting',
                params: {theme: this.num}
            });
        },
        goSelectPhoto() {
            console.log('go select photo');
            this.$router.push({
                name: 'selectPhoto',
                params: {theme: this.num}
            })
        }
    },
}
</script>
<style>
.theme-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.theme-container > img {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    /* height: 100%; */
}

.theme-container > .shelf-btn {
    margin: 10px;
    width: 224px;
    height: 42px;
}

#ontv {
    margin-top: 220px;
    background-image: url('../assets/main/View on TV button.png');
}

#style-setting {
    background-image: url('../assets/main/Style_Setting button.png');
}

#photo {
    background-image: url('../assets/main/Select Photos button.png');
}

#view-detail {
    background-image: url('../assets/main/View Details button.png');
    width: 71px;
    height: 20px;
}
</style>


