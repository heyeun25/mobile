<template>
    <div class="health">
        <div class="boardContainer">
            <transition name="slide">
                <div v-if="showBoard" class="board"></div>
            </transition>
        </div>
    </div>
</template>
<script>
// import "../utils/TweenMax.js";

export default {
    name: 'Health',
    data() {
        return {
            showBoard: false,
        }
    },
    methods: {
        getMobile: function(data) {
            if (data.value == 'addBoard') {
                this.showBoard = !this.showBoard;
            }
        }
    },
    mounted() {
        this.$socket.on('appMsg', this.getMobile);
    },
    destroyed() {
        this.$socket.off('appMsg', this.getMobile);
    },
}
</script>
<style>
.health {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('../assets/concept/Energetic-01.jpg');
    background-size: cover;
}

.boardContainer {
    position: relative;
    top: 0;
    left: 45%;
    width: 20%;
    height: 100%;
    overflow: hidden;
    /* background-color: navy; */
}

.board {
    position: absolute;
    top: 10%;
    left: 0;
    width: 300px;
    height: 500px;
    background-color: aqua;
    /* transform: translateX(-100%); */
}

.slide-enter-active, .slide-leave-active {
  transition: transform 1s;
}
.slide-enter, .slide-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateX(-100%)
}
</style>
