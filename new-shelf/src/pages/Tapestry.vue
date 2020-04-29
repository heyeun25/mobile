<template>
    <div class="tapestry">
        <Video
            width="100%"
            height="100%"
            v-bind:source="source"
        >
        </Video>
    </div>
</template>
<script>
import Video from '@/components/Video.vue'
var getMobile;
export default {
    components: {
        Video,
    },
    data() {
        return {
            source: "",
        }
    },
    methods: {
        getMobile: function(data) {
        }
    },
    mounted() {
        getMobile = this.getMobile.bind(this);
        this.$socket.on('appMsg', getMobile);
    }
}
</script>

<style>

</style>

