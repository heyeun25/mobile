<template>
    <div class="select-photo2">
        <img v-bind:src="require('../assets/photo/Select Photos 2.png')"/>
        <div class='view-on-tv' v-on:click="viewOnTv">view</div>
        <div class='go-back' v-on:click="goBack">goBack</div>
    </div>
</template>
<script>
export default {
    props: ['theme'],
    methods: {
        viewOnTv() {
            console.log('view on tv');
        },
        goBack() {
            this.$router.go(-1);
        }
    },
}
</script>
<style>
.select-photo2 {
    position: absolute;
    width: 100%;
    height: 100%;
}
.select-photo2 > img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}
.select-photo2 > .view-on-tv {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 50px;
    outline: 1px solid red;
}

.select-photo2 > .go-back {
    position: absolute;
    top: 40px;
    width: 100%;
    height: 40px;
    outline: 1px solid red;
}
</style>

