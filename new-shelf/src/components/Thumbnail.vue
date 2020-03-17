<template>
    <div class="thumbnail">
        <div v-for="(item, index) in items"
            v-bind:class="itemClass(index)"
            v-bind:key="index">
            <img v-bind:key="'img' + index"
                v-bind:src="imageSrc(item)"/>
        </div>
    </div>
</template>
<script>

export default {
    name: 'Thumbnail',
    props: {
        'changeTheme' : Function,
        'items' : Array,
    },
    data() {
        return {
            select: 0
        }
    },
    mounted() {
        
    },
    methods: {
        handleKey: function(dir) {
            console.log(dir);
            switch (dir) {
                case 'left':
                    this.select--;
                    this.select < 0 ? this.select = 0 : null;
                    break;
                case 'right':
                    this.select++;
                    this.select >= this.items.length ? this.select = this.items.length-1 : null
                    break;
                case 'enter':
                    this.changeTheme(this.select);
                    break;
                default:
                    break;
            }
            console.log(this.select);
        },
        itemClass: function (idx) {
            return (idx == this.select) ? 'item select' : 'item'
        },
        imageSrc: function(item) {
            return require(`../assets/${item}`);
        }
    },
    destroyed() {
        
    },
}
</script>
<style>
.thumbnail {
    position: absolute;
    top: 80%;
    width: 100%;
    height: 20%;
    background-color: white;
    display: flex;
}

.item {
    width: 300px;
    height: 100%;
    /* background-color: green; */
    outline: 1px solid white;
}

.item > img {
    /* position: absolute; */
    /* top: 5px; */
    margin-top: 5px;
    /* width: 280px; */
    height: 95%;
}

.select {
    box-shadow: 0 0 0 5px aqua inset;
    /* outline: 5px solid red; */
}
</style>
