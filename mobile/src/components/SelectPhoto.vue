<template>
    <div class="select-photo">
        <img v-bind:src="require('../assets/photo/Select Photos.png')"/>
        <div class="next-btn" v-on:click="goNext"></div>
        <div class="go-back" v-on:click="goBack"></div>
    </div>
</template>
<script>
export default {
    props: ['theme'],
    methods: {
        goNext() {
            console.log('go next');
            this.$router.push({name: 'selectPhoto2'});
        },
        goBack() {
            console.log('go back');
            this.$router.go(-1);
        }
    },
}
</script>
<style>
.select-photo > img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}

.select-photo > .next-btn {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 50px;
    /* outline: 1px solid red; */
}

.select-photo > .go-back {
    position: absolute;
    top: 40px;
    width: 100%;
    height: 40px;
    /* outline: 1px solid red; */
}
</style>

