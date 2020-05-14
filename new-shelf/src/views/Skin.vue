<template>
    <div class="skin">
        <img v-bind:class="greenClass" src="@/assets/shelf_BG_green_final.png"/>
        <img v-bind:class="paulClass" src="@/assets/shelf_BG_paulsmith.png">
    </div>
</template>
<script>
var getMobile;
export default {
    components: {
    },
    data() {
        return {
            greenClass: 'init',
            paulClass: 'init'
        }
    },
    methods: {
        getMobile: function(data) {
            var value = data.value;
            if (value == 'green') {
                this.greenClass = 'slide-left';
                this.paulClass = 'init';
            }
            if (value == 'paul') {
                this.paulClass = 'slide-left';
                this.greenClass = 'init';
            }
        }
    },
    mounted() {
        getMobile = this.getMobile.bind(this);
        this.$socket.on('appMsg', getMobile);
    }
}
</script>

<style>

.skin > img {
    position: absolute;
    left: -269px;
    top: -270px;
}
.init {
    transform: translate(100%)
}
.slide-left {
    animation: 1s to-left forwards;
}

.slide-right {
    animation: 1s to-right forwards;
}

@keyframes to-left {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
}

@keyframes to-right {
    from { transform: translateX(0); }
    to { transform: translateX(100%); }
}
</style>

