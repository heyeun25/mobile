<template>
    <div class="account">
        <img v-bind:src="require('../assets/account/' + imgs[id])"/>
    </div>
</template>
<script>
export default {
    name: 'Account',
    props: ['id'],
    data() {
        return {
            imgs: [
                "diana.png",
                "dunphy's.png",
                "walker.png"
            ],
        }
    },
    mounted() {
        console.log('id ', this.id);
    },
}
</script>

<style>
.account {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}
</style>
